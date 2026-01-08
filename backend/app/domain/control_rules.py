from typing import Dict, Any
from app.core.system_status import system_status

class ControlRules:
    """
    V2.6.3 - Automatic Transitions
    """
    
    @staticmethod
    def check_normal_to_dampened(metrics: Dict[str, Any]) -> bool:
        """
        NORMAL -> DAMPENED
        - Global std dev > threshold
        - OR confidence avg < 0.6
        """
        global_std_dev = metrics.get("global_std_dev", 0.0)
        confidence_avg = metrics.get("confidence_avg", 1.0)
        
        if global_std_dev > 0.3: # Threshold example
            return True
        if confidence_avg < 0.6:
            return True
        return False

    @staticmethod
    def check_dampened_to_safe_mode(metrics: Dict[str, Any]) -> bool:
        """
        DAMPENED -> SAFE_MODE
        - Golden task failure
        - Directional drift persists N times
        """
        golden_task_failure = metrics.get("golden_task_failure", False)
        directional_drift_count = metrics.get("directional_drift_count", 0)
        
        if golden_task_failure:
            return True
        if directional_drift_count >= 3: # N times example
            return True
        return False

    @staticmethod
    def check_safe_mode_to_normal(metrics: Dict[str, Any]) -> bool:
        """
        SAFE_MODE -> NORMAL
        - 3 successful calibration runs
        - Golden tasks stable
        - No drift flags for M hours
        """
        calibration_runs = metrics.get("successful_calibration_runs", 0)
        golden_tasks_stable = metrics.get("golden_tasks_stable", False)
        drift_free_hours = metrics.get("drift_free_hours", 0)
        
        if calibration_runs >= 3 and golden_tasks_stable and drift_free_hours >= 24:
            return True
        return False

    @staticmethod
    def evaluate_transitions(metrics: Dict[str, Any]):
        current_mode = system_status.status.mode
        
        if current_mode == "NORMAL":
            if ControlRules.check_normal_to_dampened(metrics):
                system_status.transition_to("DAMPENED", "Automatic transition: High variance or low confidence")
                
        elif current_mode == "DAMPENED":
            if ControlRules.check_dampened_to_safe_mode(metrics):
                system_status.transition_to("SAFE_MODE", "Automatic transition: Golden task failure or persistent drift")
                
        elif current_mode == "SAFE_MODE":
            if ControlRules.check_safe_mode_to_normal(metrics):
                system_status.transition_to("NORMAL", "Automatic transition: System stabilized")
