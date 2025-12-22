from typing import List
from ..domain.skill import SkillName

WEAK_SKILL_THRESHOLD = 0.4

def diagnose_weak_skills(skills: dict) -> List[SkillName]:
    weak_skills: List[SkillName] = []

    if skills.get('python', 0) < WEAK_SKILL_THRESHOLD:
        weak_skills.append(SkillName.python)

    if skills.get('dsa', 0) < WEAK_SKILL_THRESHOLD:
        weak_skills.append(SkillName.dsa)

    if skills.get('backend', 0) < WEAK_SKILL_THRESHOLD:
        weak_skills.append(SkillName.backend)

    return weak_skills
