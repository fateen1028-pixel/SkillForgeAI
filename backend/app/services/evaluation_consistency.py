import statistics
from typing import List, Set
from app.domain.evaluation_history import EvaluationSnapshot

MAX_SCORE_VARIANCE = 0.15

def has_score_drift(scores: List[float]) -> bool:
    if len(scores) < 3:
        return False
    return statistics.pvariance(scores) > MAX_SCORE_VARIANCE

def has_directional_drift(scores: List[float]) -> bool:
    if len(scores) < 3:
        return False
    return scores[-1] < scores[0] - 0.15

def stability_factor(history: List[EvaluationSnapshot]) -> float:
    if len(history) < 3:
        return 1.0

    scores = [h.score for h in history]
    variance = statistics.pvariance(scores)

    if variance < 0.05:
        return 1.0
    elif variance < 0.15:
        return 0.8
    else:
        return 0.5

def is_edge_case(score: float, pass_score: float) -> bool:
    return abs(score - pass_score) <= 0.05

def apply_stability_penalty(skill_delta: float, flags: Set[str]) -> float:
    if "score_drift_detected" in flags:
        return skill_delta * 0.6
    if "low_confidence_evaluation" in flags:
        return skill_delta * 0.7
    return skill_delta

def validate_evaluation_invariants(slot) -> None:
    if slot.evaluation_history:
        latest = slot.evaluation_history[-1]
        assert 0.0 <= latest.score <= 1.0, "Score out of bounds"
        assert 0.0 <= latest.confidence <= 1.0, "Confidence out of bounds"
    
    assert len(slot.evaluation_history) <= 10, "History too long"
