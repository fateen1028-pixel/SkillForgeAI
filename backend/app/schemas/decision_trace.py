from datetime import datetime
from typing import Literal, List, Dict, Any
from pydantic import BaseModel

class DecisionTrace(BaseModel):
    decision_id: str
    user_id: str
    slot_id: str

    inputs: Dict[str, Any]        # scores, confidence, history
    rules_triggered: List[str]
    flags_set: List[str]

    final_outcome: Literal[
        "PASS",
        "FAIL",
        "REMEDIATION",
        "LOCKED"
    ]

    user_message: str
    internal_reasoning: str

    created_at: datetime
