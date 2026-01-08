from app.domain.golden_tasks import GOLDEN_TASKS, GoldenTask
from app.ai.evaluate_task import evaluate_task
from app.domain.task_context import TaskContext
from app.core.system_status import system_status
from app.db.task_submission_repo import TaskSubmissionRepo
import logging

logger = logging.getLogger(__name__)

class CalibrationService:
    def __init__(self, submission_repo: TaskSubmissionRepo):
        self.submission_repo = submission_repo

    async def run_calibration(self) -> dict:
        """
        Run all golden tasks and check for drift.
        Returns a report.
        """
        results = []
        failures = 0
        
        for task in GOLDEN_TASKS:
            context = TaskContext(
                task_instance_id=task.task_id,
                skill=task.skill,
                difficulty=task.difficulty,
                question_type=task.question_type
            )
            
            try:
                eval_result = evaluate_task(context=context, payload=task.payload)
                
                # V2.5.1: Evaluator Fingerprint Check
                if task.evaluator_fingerprint:
                    current_fingerprint = f"{eval_result.model_name}:{eval_result.prompt_version}"
                    if current_fingerprint != task.evaluator_fingerprint:
                        logger.error(f"Fingerprint Mismatch for {task.task_id}. Expected {task.evaluator_fingerprint}, got {current_fingerprint}")
                        failures += 1
                        results.append({
                            "task_id": task.task_id,
                            "error": "Fingerprint Mismatch",
                            "passed_check": False
                        })
                        continue

                drift = abs(eval_result.score - task.expected_score)
                passed_check = drift <= task.tolerance
                
                if not passed_check:
                    failures += 1
                    logger.error(f"Golden Task Failed: {task.task_id}. Expected {task.expected_score}, got {eval_result.score}")

                results.append({
                    "task_id": task.task_id,
                    "expected": task.expected_score,
                    "actual": eval_result.score,
                    "drift": drift,
                    "passed_check": passed_check
                })
                
            except Exception as e:
                logger.error(f"Error running golden task {task.task_id}: {e}")
                failures += 1
                results.append({
                    "task_id": task.task_id,
                    "error": str(e),
                    "passed_check": False
                })

        # Decision Logic
        if failures > 0:
            logger.critical("Evaluator Drift Detected! Engaging Safe Mode.")
            system_status.set_freeze(True)
            system_status.reset_passes()
        else:
            # V2.5.4: Auto-recovery
            system_status.increment_passes()
            if system_status.is_frozen and system_status.get_passes() >= 3:
                logger.info("System stabilized (3 consecutive passes). Disengaging Safe Mode.")
                system_status.set_freeze(False)
            elif system_status.is_frozen:
                logger.info(f"Calibration passed ({system_status.get_passes()}/3). System remains frozen.")

        return {
            "failures": failures,
            "frozen": system_status.is_frozen,
            "details": results
        }

    async def check_global_score_stats(self):
        """
        Check for global score inflation.
        V2.5.2.1: Segmented Stats (Example usage)
        """
        # Global check
        stats = await self.submission_repo.get_global_score_stats(hours=24)
        
        # Example Segmented Check (could be looped over critical segments)
        # stats_python = await self.submission_repo.get_global_score_stats(hours=24, skill="python_basics")
        
        if not stats:
            return
            
        avg_score = stats.get("avg_score", 0.0)
        std_dev = stats.get("std_dev", 0.0)
        count = stats.get("count", 0)
        
        if count < 10:
            return # Not enough data

        # Thresholds
        if avg_score > 0.85:
            logger.warning(f"Global average score high ({avg_score}). Dampening skill deltas.")
            system_status.set_dampening(0.5)
        elif avg_score < 0.3:
             # Maybe too hard?
             pass
        else:
            system_status.set_dampening(1.0)
            
        return stats
