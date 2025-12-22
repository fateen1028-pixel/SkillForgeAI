from typing import List

async def get_all_skills(db) -> List[str]:
    skills = await db.skill_registry.find().to_list(length=100)
    return [s["_id"] for s in skills]

async def skill_exists(db, skill_id: str) -> bool:
    return await db.skill_registry.find_one({"_id": skill_id}) is not None

async def add_skill(db, skill_id: str):
    return await db.skill_registry.insert_one({"_id": skill_id})


async def deprecate_skill(db, skill_id: str):
    # Set active: false, deprecated: true
    return await db.skill_registry.update_one(
        {"_id": skill_id},
        {"$set": {"active": False, "deprecated": True}}
    )
