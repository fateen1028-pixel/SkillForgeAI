from fastapi import HTTPException, status
from app.db import user_repo
from app.schemas.user import UserSetupRequest


async def setup_user_skills(db, user_id: str, setup_payload: UserSetupRequest):
    """
    Setup user preferences and skills.
    
    1. Validate user exists
    2. Check if setup already completed
    3. Save preferences to MongoDB
    4. Mark setup as completed
    """
    # 1. Validate user exists
    user = await user_repo.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # 2. Check if setup already completed
    if user.get("is_setup_completed", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Setup already completed"
        )
    
    # 3 & 4. Save preferences and mark setup completed
    setup_data = {
        "goal": setup_payload.goal,
        "skills": setup_payload.skills,
        "languages": setup_payload.languages,
        "time_availability": setup_payload.time_availability,
        "experience_level": setup_payload.experience_level,
    }
    
    await user_repo.update_user_setup(db, user_id, setup_data)
    
    return {
        "message": "Setup completed successfully",
        "is_setup_completed": True
    }
