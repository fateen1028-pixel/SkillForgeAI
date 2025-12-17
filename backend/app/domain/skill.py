from pydantic import BaseModel
from enum import Enum

class SkillVector(BaseModel):
    python: float = 0.0
    dsa: float = 0.0
    backend: float = 0.0

class SkillName(str, Enum):
    python = "python"
    dsa = "dsa"
    backend = "backend"
