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
    
    # 3. Save setup_profile to user_learning_state
    from app.services import learning_state_service
    setup_profile = {
        "goal": setup_payload.goal,
        "goals": setup_payload.goals,
        "prior_exposure_languages": setup_payload.prior_exposure_languages,
        "time_availability": setup_payload.time_availability,
        "experience_level": setup_payload.experience_level,
    }
    await learning_state_service.create_initial_learning_state(
        db=db,
        user_id=user_id,
        roadmap_id=None,
        setup_profile=setup_profile
    )
    # 4. Mark setup as completed in users collection
    await user_repo.update_user_setup(db, user_id, {})
    return {
        "message": "Setup completed successfully",
        "is_setup_completed": True
    }
