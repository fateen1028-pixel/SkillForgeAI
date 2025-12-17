from domain.skill import SkillVector, SkillName
from services.diagnosis_service import diagnose_weak_skills

def test_detects_single_weak_skill():
    sv = SkillVector(python=0.2, dsa=0.8, backend=0.9)
    result = diagnose_weak_skills(sv)
    assert result == [SkillName.python]

def test_detects_multiple_weak_skills():
    sv = SkillVector(python=0.2, dsa=0.1, backend=0.9)
    result = diagnose_weak_skills(sv)
    assert SkillName.python in result
    assert SkillName.dsa in result
    assert SkillName.backend not in result

def test_no_weak_skills():
    sv = SkillVector(python=0.9, dsa=0.8, backend=0.7)
    result = diagnose_weak_skills(sv)
    assert result == []
