from datetime import datetime, timezone

from app.schemas.ai_evaluation import AIEvaluationResult
from app.schemas.task_instance import TaskInstance, TaskStatus
from app.schemas.task_submission import TaskSubmission
from app.schemas.roadmap_state import RoadmapState
from app.schemas.learning_state import UserLearningState

from app.ai.evaluations import evaluate_task
from app.domain.remediation_planner import build_remediation_plan
from app.domain.remediation_applier import apply_remediation_plan
from app.domain.remediation_unlocker import unlock_dependent_slots_after_remediation
from app.domain.roadmap_validator import (
    validate_roadmap_state,
    RoadmapValidationError,
)
from app.domain.skill_vector_updater import apply_skill_vector_update
from app.domain.remediation_constants import MAX_REMEDIATION_ATTEMPTS
from app.services.curriculum_service import CurriculumService

from app.domain.evaluation_history import EvaluationSnapshot
from app.services.evaluation_consistency import (
    has_score_drift,
    has_directional_drift,
    stability_factor,
    is_edge_case,
    validate_evaluation_invariants,
)


ACTIONABLE_SLOT_STATUSES = {
    "available",
    "in_progress",
    "remediation_required",
}


def merge_evaluations(a: AIEvaluationResult, b: AIEvaluationResult) -> AIEvaluationResult:
    return AIEvaluationResult(
        passed=a.passed and b.passed,
        score=round((a.score + b.score) / 2, 2),
        confidence=min(a.confidence, b.confidence),
        partial_credit=max(a.partial_credit, b.partial_credit),
        feedback=f"Double check: {a.feedback} | {b.feedback}",
        detected_concepts=list(set(a.detected_concepts + b.detected_concepts)),
        mistakes=list(set(a.mistakes + b.mistakes)),
        explanation=a.explanation
    )


def evaluate_with_double_pass(
    task_instance: TaskInstance,
    task_template,
    submission_payload: dict,
    pass_score: float = 0.6
):
    first = evaluate_task(
        task_instance=task_instance,
        task_template=task_template,
        submission_payload=submission_payload,
    )

    if is_edge_case(first.score, pass_score):
        second = evaluate_task(
            task_instance=task_instance,
            task_template=task_template,
            submission_payload=submission_payload,
        )
        return merge_evaluations(first, second), True

    return first, False


async def evaluate_submission_and_update_roadmap(
    *,
    submission: TaskSubmission,
    roadmap: RoadmapState,
    learning_state: UserLearningState,
    task_instance: TaskInstance,
    task_template,
) -> AIEvaluationResult:
    """
    Single source of truth for:
    - Evaluation
    - TaskInstance mutation
    - Slot mutation
    - Phase transitions
    - Skill vector updates

    Must always leave roadmap in a VALID state.
    """

    # ================================
    # 0. Load Policy
    # ================================
    # In a real app, track_id should be on the RoadmapState. 
    # For V2 transition, we assume 'dsa'.
    curriculum = CurriculumService.get_curriculum("dsa")
    
    slot_def = None
    for phase in curriculum.phases:
        for s in phase.slots:
            if s.id == task_instance.slot_id:
                slot_def = s
                break
        if slot_def: break

    # ================================
    # 1. Run evaluation
    # ================================
    # Retrieve slot early for context
    slot = roadmap.get_slot(task_instance.slot_id)
    pass_threshold = slot_def.mastery.pass_score if slot_def else 0.6

    evaluation, double_pass = evaluate_with_double_pass(
        task_instance=task_instance,
        task_template=task_template,
        submission_payload=submission.payload,
        pass_score=pass_threshold
    )
    
    # ================================
    # 1.5 Apply Integrity Penalties (V2.2)
    # ================================
    final_score = evaluation.score
    
    # V2.4: Evaluation Consistency & Drift Control
    # -------------------------------------------------
    # 1. Update History
    snapshot = EvaluationSnapshot(
        submission_id=submission.id,
        score=evaluation.score,
        confidence=evaluation.confidence,
        is_partial_credit=evaluation.partial_credit > 0,
        evaluated_at=datetime.now(timezone.utc)
    )
    slot.evaluation_history.append(snapshot)
    
    # Trim history
    if len(slot.evaluation_history) > 10:
        slot.evaluation_history = slot.evaluation_history[-10:]

    # 2. Check Flags
    slot.flags.clear()

    if double_pass:
        slot.flags.add("double_pass_used")

    scores = [e.score for e in slot.evaluation_history]
    if has_score_drift(scores) or has_directional_drift(scores):
        slot.flags.add("score_drift_detected")

    # 3. Confidence Decay
    effective_conf = evaluation.confidence * stability_factor(slot.evaluation_history)
    evaluation.confidence = round(effective_conf, 2)
    
    if evaluation.confidence < 0.4:
        slot.flags.add("low_confidence_evaluation")

    # 4. UX Truthfulness
    if "score_drift_detected" in slot.flags:
        slot.user_message = "We rechecked your solution to ensure fairness."
    elif "low_confidence_evaluation" in slot.flags:
        slot.user_message = "Your answer was reviewed carefully due to ambiguity."
    else:
        slot.user_message = None

    # 5. Invariants
    validate_evaluation_invariants(slot)

    if submission.hint_used:
        final_score *= 0.8 # 20% penalty for using hints
        
    if submission.time_spent_seconds is not None and submission.time_spent_seconds < 10:
        # Whitelist: MCQs, Easy tasks, Re-attempts
        is_mcq = task_template.question_type == 'mcq'
        is_easy = task_template.difficulty == 'easy'
        is_reattempt = slot.remediation_attempts > 0
        
        if not (is_mcq or is_easy or is_reattempt):
            # Suspiciously fast
            final_score *= 0.5
            evaluation.confidence *= 0.5 # Lower confidence in this result
        
    evaluation.score = final_score

    now = datetime.now(timezone.utc)

    # ================================
    # 2. Mutate TaskInstance (Apply Mastery Policy)
    # ================================
    pass_threshold = slot_def.mastery.pass_score if slot_def else 0.6
    passed = evaluation.score >= pass_threshold
    
    # Detect Near Miss (V2.1)
    # V3: Continuous partial credit
    lower_bound = pass_threshold - 0.15
    if not passed and evaluation.score >= lower_bound:
        # Normalize to 0.0 - 1.0 range within the near miss window
        if pass_threshold > lower_bound:
            normalized_credit = (evaluation.score - lower_bound) / (pass_threshold - lower_bound)
            evaluation.partial_credit = max(0.0, min(1.0, normalized_credit))
    
    # Enforce policy override on the evaluation object
    if passed != evaluation.passed:
        evaluation.passed = passed

    task_instance.status = (
        TaskStatus.COMPLETED if passed else TaskStatus.FAILED
    )
    task_instance.completed_at = now

    # ================================
    # 3. Mutate Slot (Apply Unlock Policy)
    # ================================
    # slot already retrieved above
    was_remediation = slot.remediation_attempts > 0
    
    if passed:
        slot.status = "completed"
        slot.current_remediation_step = 0 # Reset on pass
        slot.user_message = "Completed successfully."
        
        # Policy-based unlocking
        if slot_def and slot_def.unlocks:
            for unlock_id in slot_def.unlocks:
                target_slot = roadmap.get_slot(unlock_id)
                if target_slot and target_slot.status == "locked":
                    target_slot.status = "available"
                    target_slot.locked_reason = None
        else:
            # Fallback for legacy behavior if no unlocks defined
            _unlock_next_slot_in_phase(roadmap, slot.slot_id)
            
    else:
        # If already in remediation, advance to the next strategy step.
        # If this was the first failure (standard task), we stay at step 0
        # so the resolver picks the first remediation strategy.
        if slot.status == "remediation_required":
            slot.current_remediation_step += 1
            
        slot.status = "remediation_required"
        slot.remediation_attempts += 1 # Keep for historical tracking
        
        # V2.3: Truthful Remediation Message
        strategies = slot_def.remediation.strategies if slot_def and slot_def.remediation else []
        
        # Note: current_remediation_step is 0-indexed.
        if slot.current_remediation_step < len(strategies):
            next_strategy = strategies[slot.current_remediation_step]
            slot.user_message = f"Keep going. Next step: {next_strategy.replace('_', ' ').title()}."
        else:
            slot.user_message = "Remediation steps exhausted. Slot locked."

    slot.active_task_instance_id = None

    # ================================
    # Strategy Exhaustion Check (Apply Remediation Policy)
    # ================================
    strategies = slot_def.remediation.strategies if slot_def and slot_def.remediation else []
    max_steps = len(strategies) if strategies else (slot_def.remediation.max_attempts if slot_def else MAX_REMEDIATION_ATTEMPTS)

    # If we have exhausted the defined strategy steps
    if slot.current_remediation_step >= max_steps:
        slot.status = "failed"
        slot.user_message = "Multiple remediation attempts did not resolve this concept. Please review the material."

        active_phase = next(
            p for p in roadmap.phases
            if any(s.slot_id == slot.slot_id for s in p.slots)
        )

        active_phase.phase_status = "locked"
        active_phase.locked_reason = f"Dependency failed: {slot.slot_id}"

        roadmap.status = "locked"
        roadmap.locked_reason = f"Critical failure in {slot.slot_id}. Curriculum paused."

        return evaluation

    # ================================
    # Apply remediation plan on failure
    # ================================
    if not passed:
        plan = build_remediation_plan(
            roadmap=roadmap,
            failed_task=task_instance,
        )
        apply_remediation_plan(
            roadmap=roadmap,
            plan=plan,
        )

    # ================================
    # A7: Unlock dependent slots
    # ================================
    if passed and was_remediation:
        unlock_dependent_slots_after_remediation(
            roadmap=roadmap,
            remediated_slot_id=slot.slot_id,
        )

    # ================================
    # 4. Update roadmap metadata
    # ================================
    roadmap.last_evaluated_at = now

    # ================================
    # 5. Phase transition logic
    # ================================
    _resolve_active_phase(roadmap)

    # ================================
    # A9: HARD INVARIANT VALIDATION
    # ================================
    try:
        validate_roadmap_state(roadmap)
    except RoadmapValidationError as e:
        raise RuntimeError(
            f"Roadmap invariant violated after evaluation cycle: {e}"
        )

    # ================================
    # A10: Skill vector update
    # ================================
    apply_skill_vector_update(
        learning_state=learning_state,
        evaluation=evaluation,
        task_instance=task_instance,
        task_template=task_template,
        flags=slot.flags,
    )

    return evaluation


def _unlock_next_slot_in_phase(roadmap: RoadmapState, current_slot_id: str) -> None:
    """
    Finds the active phase and unlocks the next slot if the current one is completed.
    """
    active_phase = next(
        (p for p in roadmap.phases if p.phase_status == "active"),
        None
    )
    if not active_phase:
        return

    # Find index of current slot
    try:
        current_idx = next(
            i for i, s in enumerate(active_phase.slots) 
            if s.slot_id == current_slot_id
        )
    except StopIteration:
        return

    # Check if there is a next slot
    if current_idx + 1 < len(active_phase.slots):
        next_slot = active_phase.slots[current_idx + 1]
        if next_slot.status == "locked":
            next_slot.status = "available"
            next_slot.locked_reason = None


def _resolve_active_phase(roadmap: RoadmapState) -> None:
    """
    Ensures roadmap invariants:
    - Active phase must have actionable slots
    - Empty phases are auto-completed
    """

    while True:
        active_phase = next(
            (p for p in roadmap.phases if p.phase_status == "active"),
            None,
        )

        if not active_phase:
            return

        has_actionable = any(
            slot.status in ACTIONABLE_SLOT_STATUSES
            for slot in active_phase.slots
        )

        if has_actionable:
            return

        # No actionable slots → complete this phase
        active_phase.phase_status = "completed"

        # Find next locked phase
        next_phase = next(
            (p for p in roadmap.phases if p.phase_status == "locked"),
            None,
        )

        if not next_phase:
            roadmap.status = "completed"
            roadmap.is_active = False
            return

        # Unlock it
        next_phase.phase_status = "active"
        next_phase.locked_reason = None
        roadmap.current_phase = next_phase.phase_id

        # Unlock its slots
        for slot in next_phase.slots:
            if slot.status == "locked":
                slot.status = "available"

        # Loop again in case THIS phase is also empty

