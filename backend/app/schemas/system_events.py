from datetime import datetime
from typing import Literal, Dict, Any
from pydantic import BaseModel

class SystemEvent(BaseModel):
    event_type: Literal[
        "SAFE_MODE_ENTER",
        "SAFE_MODE_EXIT",
        "EVALUATOR_REGRESSION",
        "DRIFT_DETECTED",
        "CALIBRATION_RUN",
        "CURRICULUM_CHANGE",
        "SYSTEM_FREEZE",
        "SYSTEM_UNFREEZE",
        "MANUAL_DAMPENING"
    ]
    severity: Literal["info", "warning", "critical"]
    payload: Dict[str, Any]
    created_at: datetime
