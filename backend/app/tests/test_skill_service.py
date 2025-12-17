from domain.skill import SkillVector,SkillName
from services.skill_service import apply_skill_update

def test_skill_update_increases_value():
    sv = SkillVector(python=0.5)
    updated = apply_skill_update(sv, SkillName.python, 0.2)
    assert updated.python == 0.7

def test_skill_update_caps_at_one():
    sv = SkillVector(python=0.9)
    updated = apply_skill_update(sv, SkillName.python, 0.5)
    assert updated.python == 1.0

def test_skill_update_floors_at_zero():
    sv = SkillVector(python=0.1)
    updated = apply_skill_update(sv, SkillName.python, -0.5)
    assert updated.python == 0.0