from app.schemas.roadmap_state import RoadmapState


class RoadmapValidationError(Exception):
    """Raised when a roadmap violates system invariants."""
    pass


def validate_roadmap_state(roadmap: RoadmapState) -> None:
    """
    Strict validation of roadmap integrity and lifecycle rules.
    This function enforces STATE MACHINE correctness, not just structure.
    """

    # ─────────────────────────────────────────────
    # 1️⃣ Identity & basic invariants
    # ─────────────────────────────────────────────
    if not roadmap.user_id:
        raise RoadmapValidationError("Missing user_id")

    if not roadmap.goal:
        raise RoadmapValidationError("Missing goal")

    if not roadmap.phases:
        raise RoadmapValidationError("No phases defined")

    if roadmap.status not in {"active", "completed", "archived"}:
        raise RoadmapValidationError(f"Invalid roadmap status: {roadmap.status}")

    # ─────────────────────────────────────────────
    # 2️⃣ Timestamp integrity
    # ─────────────────────────────────────────────
    if roadmap.generated_at.tzinfo is None or roadmap.last_evaluated_at.tzinfo is None:
        raise RoadmapValidationError("Timestamps must be timezone-aware")

    if roadmap.last_evaluated_at < roadmap.generated_at:
        raise RoadmapValidationError("last_evaluated_at < generated_at")

    # ─────────────────────────────────────────────
    # 3️⃣ Active phase enforcement
    # ─────────────────────────────────────────────
    active_phases = [p for p in roadmap.phases if p.phase_status == "active"]

    if roadmap.status == "active":
        if len(active_phases) != 1:
            raise RoadmapValidationError(
                f"Exactly one active phase required, found {len(active_phases)}"
            )
    else:
        if active_phases:
            raise RoadmapValidationError(
                "Non-active roadmap cannot contain an active phase"
            )

    active_phase = active_phases[0] if active_phases else None

    if roadmap.status == "active":
        if roadmap.current_phase != active_phase.phase_id:
            raise RoadmapValidationError(
                "current_phase does not match active phase"
            )

    # ─────────────────────────────────────────────
    # 4️⃣ Slot lifecycle & uniqueness rules
    # ─────────────────────────────────────────────
    valid_slot_statuses = {
        "locked",
        "available",
        "in_progress",
        "completed",
        "failed",
        "remediation_required"
    }

    in_progress_count = 0

    for phase in roadmap.phases:
        slot_ids = set()

        for slot in phase.slots:
            # Duplicate slot IDs
            if slot.slot_id in slot_ids:
                raise RoadmapValidationError(
                    f"Duplicate slot_id {slot.slot_id}"
                )
            slot_ids.add(slot.slot_id)

            # Valid status
            if slot.status not in valid_slot_statuses:
                raise RoadmapValidationError(
                    f"Invalid slot status {slot.status}"
                )

            # active_task_instance_id rules
            if slot.status == "in_progress":
                if not slot.active_task_instance_id:
                    raise RoadmapValidationError(
                        f"Slot {slot.slot_id} in_progress without active_task_instance_id"
                    )
                in_progress_count += 1
            else:
                if slot.active_task_instance_id is not None:
                    raise RoadmapValidationError(
                        f"Slot {slot.slot_id} has illegal active_task_instance_id"
                    )

        # ─────────────────────────────────────────
        # 5️⃣ Phase ↔ slot consistency
        # ─────────────────────────────────────────
        if phase.phase_status == "locked":
            if not phase.locked_reason:
                raise RoadmapValidationError(
                    f"Phase {phase.phase_id} locked but missing locked_reason"
                )

            for slot in phase.slots:
                if slot.status != "locked":
                    raise RoadmapValidationError(
                        f"Locked phase {phase.phase_id} contains non-locked slot"
                    )

        if phase.phase_status == "active":
            if not any(
                slot.status in {"available", "in_progress"}
                for slot in phase.slots
            ):
                raise RoadmapValidationError(
                    f"Active phase {phase.phase_id} has no actionable slots"
                )

    # ─────────────────────────────────────────────
    # 6️⃣ Cross-roadmap slot constraints
    # ─────────────────────────────────────────────
    if in_progress_count > 1:
        raise RoadmapValidationError(
            "Multiple in_progress slots across roadmap"
        )

    # ─────────────────────────────────────────────
    # 7️⃣ Roadmap status semantics
    # ─────────────────────────────────────────────
    if roadmap.status == "completed":
        if roadmap.is_active:
            raise RoadmapValidationError(
                "Completed roadmap cannot be active"
            )

        if any(p.phase_status == "active" for p in roadmap.phases):
            raise RoadmapValidationError(
                "Completed roadmap contains active phase"
            )

    # ✅ All invariants satisfied
    return
