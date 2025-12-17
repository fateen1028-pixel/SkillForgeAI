from domain.skill import SkillVector,SkillName

def apply_skill_update(
    skill_vector: SkillVector,
    skill: SkillName,
    delta: float
) -> SkillVector:
    current = getattr(skill_vector, skill.value)
    new_value = min(max(current + delta, 0.0), 1.0)
    setattr(skill_vector, skill.value, new_value)
    return skill_vector
