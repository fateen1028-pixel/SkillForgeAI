from datetime import datetime
from bson import ObjectId
from app.schemas.skill_history import SkillHistory

async def add_skill_history(db, history: dict):
    history['timestamp'] = datetime.utcnow()
    result = await db.skill_history.insert_one(history)
    return str(result.inserted_id)

async def get_skill_history_for_user(db, user_id: str, skill: str = None):
    query = {"user_id": ObjectId(user_id)}
    if skill:
        query["skill"] = skill
    return await db.skill_history.find(query).to_list(length=1000)
