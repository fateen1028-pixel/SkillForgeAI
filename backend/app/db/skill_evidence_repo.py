from datetime import datetime
from bson import ObjectId
from app.schemas.skill_evidence import SkillEvidence


async def add_skill_evidence(db, evidence: dict):
    evidence['created_at'] = datetime.utcnow()
    result = await db.skill_evidence.insert_one(evidence)
    return str(result.inserted_id)


async def get_skill_evidence_for_user(db, user_id: str, skill: str = None):
    query = {"user_id": ObjectId(user_id)}
    if skill:
        query["affected_skills"] = skill
    return await db.skill_evidence.find(query).to_list(length=1000)
