from app.db import learning_state_repo
from app.schemas.learning_state import UserLearningState
from fastapi import HTTPException, status
from datetime import datetime

async def create_initial_learning_state(db, user_id: str, roadmap_id: str = None, setup_profile: dict = None):
    # Create a new user_learning_state document for the user
    return await learning_state_repo.create_user_learning_state(db, user_id, roadmap_id, setup_profile=setup_profile)

async def get_learning_state(db, user_id: str):
    state = await learning_state_repo.get_user_learning_state(db, user_id)
    if not state:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Learning state not found")
    return state

async def update_learning_state(db, user_id: str, update_data: dict):
    result = await learning_state_repo.update_user_learning_state(db, user_id, update_data)
    if result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Learning state not updated")
    return await get_learning_state(db, user_id)
