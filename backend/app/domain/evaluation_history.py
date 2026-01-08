from datetime import datetime
from pydantic import BaseModel

class EvaluationSnapshot(BaseModel):
    submission_id: str
    score: float
    confidence: float
    is_partial_credit: bool
    evaluated_at: datetime
