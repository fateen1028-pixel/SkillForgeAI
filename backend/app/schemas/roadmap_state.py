from pydantic import BaseModel
from typing import List, Literal,Optional
from datetime import datetime

class TaskSlot(BaseModel):
    slot_id: str
    skill: str
    difficulty: Literal["easy", "medium", "hard"]
    status: Literal[
        "locked",
        "available",
        "in_progress",
        "completed",
        "failed",
        "remediation_required",
    ]
    active_task_instance_id: Optional[str] = None


class PhaseState(BaseModel):
    phase_id: int
    name: str
    phase_status: Literal["locked", "active", "completed"]
    slots: List[TaskSlot]
    locked_reason: Optional[str] = None

    model_config = {
        "extra": "forbid"
    }


class RoadmapState(BaseModel):
    user_id: str
    goal: str
    version: int
    status: Literal["active", "completed", "locked"]
    is_active: bool

    current_phase: int
    phases: List[PhaseState]

    locked_reason: Optional[str] = None

    generated_at: datetime
    last_evaluated_at: datetime

    def get_slot(self, slot_id: str) -> TaskSlot:
        for phase in self.phases:
            for slot in phase.slots:
                if slot.slot_id == slot_id:
                    return slot
        raise ValueError(f"Slot with id {slot_id} not found")
