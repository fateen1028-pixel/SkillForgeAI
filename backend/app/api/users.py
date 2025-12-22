from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user, get_db
from app.schemas.user import UserSetupRequest, UserSetupResponse
from app.services import user_service

router = APIRouter()


@router.get("/current_user")
async def current_user(user=Depends(get_current_user)):
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "is_setup_completed": user.get("is_setup_completed", False)
    }


@router.post("/setup_user", response_model=UserSetupResponse)
async def setup_user(
    payload: UserSetupRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    return await user_service.setup_user_skills(
        db=db,
        user_id=str(current_user["_id"]),
        setup_payload=payload
    )


#ENTIRE USER DETAILS FROM MONGO DB
@router.get("/general_profile")
async def get_user_profile(user=Depends(get_current_user)):
    """Return full user profile data."""
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name"),
        "is_setup_completed": user.get("is_setup_completed", False),
        "created_at": user.get("created_at"),
    }