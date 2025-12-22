from datetime import datetime
from bson import ObjectId
from app.schemas.learning_state import UserLearningState, SkillEntry
from app.db.skill_registry_repo import skill_exists
from fastapi import HTTPException, status

async def create_user_learning_state(db, user_id: str, roadmap_id: str = None, setup_profile: dict = None):
    now = datetime.utcnow()
    doc = {
        "user_id": ObjectId(user_id),
        "skill_vector": {},  # dynamic map, initially empty
        "active_tasks": [],
        "completed_tasks": [],
        "goals": setup_profile.get("goals", []) if setup_profile else [],
        "prior_exposure_languages": setup_profile.get("prior_exposure_languages", []) if setup_profile else [],
        "created_at": now,
        "updated_at": now,
    }
    if setup_profile:
        for k, v in setup_profile.items():
            if k not in ["goals", "prior_exposure_languages"]:
                doc[k] = v
    result = await db.user_learning_state.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc

async def add_or_update_skill(db, user_id: str, skill_id: str, skill_data: dict):
    # Validate skill_id against registry
    if not await skill_exists(db, skill_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Skill '{skill_id}' is not in the registry.")
    # Ensure skill_data matches SkillEntry structure
    entry = SkillEntry(**skill_data)
    await db.user_learning_state.update_one(
        {"user_id": ObjectId(user_id)},
        {"$set": {f"skill_vector.{skill_id}": entry.dict()}}
    )

async def get_user_learning_state(db, user_id: str):
    return await db.user_learning_state.find_one({"user_id": ObjectId(user_id)})

async def update_user_learning_state(db, user_id: str, update_data: dict):
    update_data["updated_at"] = datetime.utcnow()
    return await db.user_learning_state.update_one(
        {"user_id": ObjectId(user_id)},
        {"$set": update_data}
    )
