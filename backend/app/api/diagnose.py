from fastapi import APIRouter
from ..services.diagnosis_service import diagnose_weak_skills

router = APIRouter(prefix="/diagnose", tags=["diagnose"])

@router.post("/")
def diagnose(skills: dict):
    weak_skills = diagnose_weak_skills(skills)
    return {
        "weak_skills": [skill.value for skill in weak_skills]
    }
