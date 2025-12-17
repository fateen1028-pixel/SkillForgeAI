from typing import List
from ..domain.skill import SkillVector, SkillName

WEAK_SKILL_THRESHOLD = 0.4

def diagnose_weak_skills(skill_vector: SkillVector) -> List[SkillName]:
    weak_skills: List[SkillName] = []

    if skill_vector.python < WEAK_SKILL_THRESHOLD:
        weak_skills.append(SkillName.python)

    if skill_vector.dsa < WEAK_SKILL_THRESHOLD:
        weak_skills.append(SkillName.dsa)

    if skill_vector.backend < WEAK_SKILL_THRESHOLD:
        weak_skills.append(SkillName.backend)

    return weak_skills
