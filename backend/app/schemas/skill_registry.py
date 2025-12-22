from pydantic import BaseModel

class SkillRegistryEntry(BaseModel):
    _id: str  # skill id, e.g. "problem_decomposition"
    active: bool = True
    deprecated: bool = False
