from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict
from enum import Enum
import uuid


class TaskStatus(str, Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class TaskInstance(BaseModel):
    task_instance_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slot_id: str
    task_template_id: str
    difficulty: str

    status: TaskStatus = TaskStatus.IN_PROGRESS

    started_at: datetime
    completed_at: Optional[datetime] = None

    evaluation_signals: Dict[str, float] = {}
