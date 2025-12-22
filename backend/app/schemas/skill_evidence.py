from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SkillEvidence(BaseModel):
    user_id: str
    affected_skills: list[str]  # List of skill ids affected by this evidence
    source: str  # e.g., 'task_submission', 'quiz', etc.
    task_id: Optional[str] = None
    result: str  # 'success', 'partial', 'fail'
    difficulty: int
    time_spent: int  # seconds
    created_at: datetime = Field(default_factory=datetime.utcnow)
