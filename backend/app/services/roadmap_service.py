from datetime import datetime, timezone
from app.schemas.roadmap_state import RoadmapState, PhaseState, TaskSlot
from app.services.curriculum_service import CurriculumService

def generate_v1_roadmap(user_id: str, goal: str) -> RoadmapState:
    # Load curriculum (defaulting to 'dsa' for now, or based on goal)
    track_id = "dsa" 
    curriculum = CurriculumService.get_curriculum(track_id)
    
    now = datetime.now(timezone.utc)
    
    phases = []
    for i, phase_def in enumerate(curriculum.phases):
        slots = []
        for slot_def in phase_def.slots:
            slots.append(TaskSlot(
                slot_id=slot_def.id,
                skill=slot_def.skill,
                difficulty=slot_def.difficulty,
                question_type=slot_def.question_type,
                status="locked"
            ))
        
        phase_status = "locked"
        locked_reason = "Complete previous phase"
        if i == 0:
            phase_status = "active"
            locked_reason = None
            # Unlock first slot of first phase
            if slots:
                slots[0].status = "available"
        
        phases.append(PhaseState(
            phase_id=phase_def.phase_id,
            name=phase_def.name,
            phase_status=phase_status,
            locked_reason=locked_reason,
            slots=slots
        ))

    return RoadmapState(
        user_id=user_id,
        goal=goal,
        version=1,
        status="active",
        is_active=True,
        task_instances=[],
        current_phase=curriculum.phases[0].phase_id if curriculum.phases else "unknown",
        confidence_threshold=0.75,
        phases=phases,
        generated_at=now,
        last_evaluated_at=now,
    )
