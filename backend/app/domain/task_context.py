# app/domain/task_context.py
from pydantic import BaseModel
from typing import Literal


class TaskContext(BaseModel):
    task_instance_id: str
    skill: str
    difficulty: str # Relaxed from Literal to allow flexibility, or should be Literal["easy", "medium", "hard"]
    question_type: str
