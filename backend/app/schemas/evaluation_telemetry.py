from datetime import datetime
from pydantic import BaseModel

class EvaluationTelemetry(BaseModel):
    evaluation_id: str
    user_id: str
    slot_id: str
    task_instance_id: str

    score: float
    confidence: float
    is_partial_credit: bool

    model_name: str
    model_version: str
    prompt_version: str
    temperature: float

    double_pass_used: bool
    score_drift_detected: bool
    directional_drift_detected: bool
    low_confidence: bool

    created_at: datetime
