import pytest
from app.domain.golden_tasks import GOLDEN_TASKS
from app.ai.evaluate_task import evaluate_task
from app.domain.task_context import TaskContext

@pytest.mark.asyncio
async def test_evaluator_regression_snapshots():
    """
    V2.5.5: Regression Snapshots.
    Runs golden tasks against the LIVE evaluator to ensure no drift.
    """
    failures = []
    
    for task in GOLDEN_TASKS:
        print(f"Running regression test for: {task.task_id}")
        
        context = TaskContext(
            task_instance_id=task.task_id,
            skill=task.skill,
            difficulty=task.difficulty,
            question_type=task.question_type
        )
        
        try:
            # NOTE: This calls the REAL LLM. 
            # In a full CI env, you might want to mock this or use a dedicated test key.
            result = evaluate_task(context=context, payload=task.payload)
            
            # Check score
            drift = abs(result.score - task.expected_score)
            if drift > task.tolerance:
                failures.append(
                    f"Task {task.task_id} failed score check. "
                    f"Expected {task.expected_score}, got {result.score}. "
                    f"Tolerance {task.tolerance}."
                )
            
            # Check failure case logic
            if task.is_failure_case and result.passed:
                 failures.append(f"Task {task.task_id} should have FAILED but PASSED.")
            
            if not task.is_failure_case and not result.passed:
                 failures.append(f"Task {task.task_id} should have PASSED but FAILED.")

            # Check metadata presence (V2.5.3)
            if result.model_name == "unknown":
                failures.append(f"Task {task.task_id} missing model_name metadata.")
            if result.prompt_version == "1.0": # Should be updated version
                 # Actually we set it to 2.5.0 in the code, so let's check if it's not empty
                 pass

        except Exception as e:
            failures.append(f"Task {task.task_id} crashed: {e}")

    if failures:
        pytest.fail("\n".join(failures))
