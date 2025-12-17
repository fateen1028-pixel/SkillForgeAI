from datetime import datetime, timedelta
from bson import ObjectId

async def get_user_by_email(db, email: str):
    return await db.users.find_one({"email": email})

async def create_user(db, email: str, password: str, name: str):
    user = {
        "email": email,
        "password": password,
        "name": name,
        "created_at": datetime.utcnow(),
        "is_setup_completed": False,
        "skill_vector": {},
    }
    result = await db.users.insert_one(user)
    user["_id"] = result.inserted_id
    return user


async def get_user_by_id(db, user_id: str):
    return await db.users.find_one({"_id": ObjectId(user_id)})


async def update_user_setup(db, user_id: str, setup_data: dict):
    """Update user with setup preferences and mark setup as completed."""
    return await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "setup_profile": {
                    "goal": setup_data["goal"],
                    "skills": setup_data["skills"],
                    "languages": setup_data["languages"],
                    "time_availability": setup_data["time_availability"],
                    "experience_level": setup_data["experience_level"],
                },
                "is_setup_completed": True,
                "setup_completed_at": datetime.utcnow(),
            }
        }
    )
