from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class RoadmapSkillEntry(BaseModel):
    skill_id: str
    target_level: int
    priority: int
    prerequisites: List[str] = Field(default_factory=list)
    reason: Optional[str] = None

class UserRoadmap(BaseModel):
    _id: str
    user_id: str
    goal: str
    version: int
    status: str
    generated_at: datetime
    last_evaluated_at: datetime
    confidence_threshold: float
    skills: List[RoadmapSkillEntry]
