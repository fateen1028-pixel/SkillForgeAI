import yaml
from pathlib import Path
from typing import Dict, Optional
from app.schemas.curriculum import Curriculum
from app.core.config import settings

# ROOT_DIR is the backend directory
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
CURRICULUM_DIR = ROOT_DIR / settings.CURRICULUM_ROOT

class CurriculumService:
    _cache: Dict[str, Curriculum] = {}

    @classmethod
    def get_curriculum(cls, track_id: str) -> Curriculum:
        """
        Loads a curriculum by track_id from the YAML file.
        """
        if track_id in cls._cache:
            return cls._cache[track_id]

        file_path = CURRICULUM_DIR / f"{track_id}.yaml"
        
        if not file_path.exists():
            raise FileNotFoundError(f"Curriculum file not found: {file_path}")

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
            
            curriculum = Curriculum(**data)
            cls._cache[track_id] = curriculum
            return curriculum
        except yaml.YAMLError as e:
             raise ValueError(f"Invalid YAML format for curriculum {track_id}: {str(e)}")
        except Exception as e:
            raise ValueError(f"Failed to parse curriculum {track_id}: {str(e)}")

    @classmethod
    def clear_cache(cls):
        cls._cache = {}
