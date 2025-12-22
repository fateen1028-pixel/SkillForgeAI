from pydantic import BaseModel
from enum import Enum

# SkillVector is deprecated, use dynamic skill dicts instead
# Remove or refactor any usage of SkillVector in this file

class SkillName(str, Enum):
    python = "python"
    dsa = "dsa"
    backend = "backend"
