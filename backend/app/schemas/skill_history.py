from pydantic import BaseModel
from datetime import datetime

class SkillHistory(BaseModel):
    user_id: str
    skill: str
    old_level: int
    new_level: int
    reason: str
    timestamp: datetime
