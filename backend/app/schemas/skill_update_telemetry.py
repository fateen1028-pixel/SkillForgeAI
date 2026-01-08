from datetime import datetime
from pydantic import BaseModel

class SkillUpdateTelemetry(BaseModel):
    user_id: str
    skill: str

    raw_delta: float
    dampened_delta: float
    final_delta: float

    stability_factor: float
    confidence_weight: float
    safe_mode_active: bool

    evaluation_id: str
    created_at: datetime
