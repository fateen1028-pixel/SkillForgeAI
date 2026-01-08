from pydantic import BaseModel, Field
from typing import List, Optional


class AIEvaluationResult(BaseModel):
    passed: bool
    score: float = Field(..., ge=0.0, le=1.0, description="0.0 to 1.0 score")
    feedback: str
    
    confidence: float = Field(default=1.0, ge=0.0, le=1.0, description="AI confidence in its evaluation")
    # V3: Continuous partial credit (0.0-1.0). 0.0 means no partial credit.
    partial_credit: float = Field(default=0.0, ge=0.0, le=1.0, description="Continuous partial credit score")
    
    detected_concepts: List[str] = Field(default_factory=list)
    mistakes: List[str] = Field(default_factory=list)
    explanation: Optional[str] = None

    # V2.5: Evaluator Versioning & Metadata
    model_name: str = "unknown"
    model_version: str = "0.0.0"
    prompt_version: str = "1.0"
    temperature: float = 0.0
