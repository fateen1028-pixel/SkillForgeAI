from pydantic import BaseModel
from typing import List, Optional

class GoldenTask(BaseModel):
    task_id: str
    description: str
    skill: str
    difficulty: str
    question_type: str
    
    # The input payload to send to the evaluator
    payload: dict
    
    # Expected outcome
    expected_score: float
    tolerance: float = 0.1
    
    # Is this a "bad" submission that should fail?
    is_failure_case: bool = False
    
    # V2.5.1: Evaluator Fingerprint (model_name:prompt_version)
    evaluator_fingerprint: Optional[str] = None

GOLDEN_TASKS = [
    GoldenTask(
        task_id="golden_python_sum_pass",
        description="Simple sum function - Correct",
        skill="python_basics",
        difficulty="easy",
        question_type="coding",
        payload={
            "language": "python",
            "code": "def sum_list(nums):\n    return sum(nums)"
        },
        expected_score=1.0,
        tolerance=0.05
    ),
    GoldenTask(
        task_id="golden_python_sum_fail",
        description="Simple sum function - Incorrect logic",
        skill="python_basics",
        difficulty="easy",
        question_type="coding",
        payload={
            "language": "python",
            "code": "def sum_list(nums):\n    return 0 # Wrong"
        },
        expected_score=0.0,
        tolerance=0.2, # Allow some partial credit for syntax if any
        is_failure_case=True
    ),
    GoldenTask(
        task_id="golden_explanation_pass",
        description="Explain recursion - Good",
        skill="computer_science",
        difficulty="medium",
        question_type="explanation",
        payload={
            "text": "Recursion is when a function calls itself to solve a smaller instance of the problem, until it reaches a base case."
        },
        expected_score=0.9,
        tolerance=0.15
    )
]
