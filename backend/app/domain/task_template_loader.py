# app/domain/task_template_loader.py

from typing import Dict, List
from app.schemas.task_template import TaskTemplate
from app.services.task_factory import TaskFactory, TASK_DIR

_DYNAMIC_TEMPLATE_CACHE: Dict[str, TaskTemplate] = {}
_LOADED = False


def _ensure_loaded():
    """
    Lazily loads all available task templates from YAML files via TaskFactory
    into the local cache.
    """
    global _LOADED
    if _LOADED:
        return

    # Iterate over all YAML files in the task directory (recursively)
    if TASK_DIR.exists():
        for file_path in TASK_DIR.rglob("*.yaml"):
            # Use relative path stem or specific logic if nested
            skill_name = file_path.stem
            templates = TaskFactory.load_tasks_from_file(file_path)
            
            for template in templates:
                _DYNAMIC_TEMPLATE_CACHE[template.task_template_id] = template

    _LOADED = True


def get_task_template(task_template_id: str) -> TaskTemplate:
    """
    Retrieves a single task template by its unique ID.
    """
    _ensure_loaded()
    try:
        return _DYNAMIC_TEMPLATE_CACHE[task_template_id]
    except KeyError:
        raise RuntimeError(
            f"TaskTemplate not found: {task_template_id}"
        )


def get_all_templates() -> List[TaskTemplate]:
    """
    Returns a list of all loaded task templates.
    """
    _ensure_loaded()
    return list(_DYNAMIC_TEMPLATE_CACHE.values())
