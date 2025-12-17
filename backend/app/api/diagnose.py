from fastapi import APIRouter
from ..domain.skill import SkillVector
from ..services.diagnosis_service import diagnose_weak_skills

router = APIRouter(prefix="/diagnose", tags=["diagnose"])

@router.post("/")
def diagnose(skills: SkillVector):
    weak_skills = diagnose_weak_skills(skills)
    return {
        "weak_skills": [skill.value for skill in weak_skills]
    }
