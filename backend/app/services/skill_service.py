from domain.skill import SkillName

def apply_skill_update(
    skill_dict: dict,
    skill: SkillName,
    delta: float
) -> dict:
    current = skill_dict.get(skill.value, 0.0)
    new_value = min(max(current + delta, 0.0), 1.0)
    skill_dict[skill.value] = new_value
    return skill_dict
