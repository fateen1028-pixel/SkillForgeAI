# app/api/login.py
from fastapi import APIRouter, Depends, Response, HTTPException
from app.schemas.user import LoginRequest, LoginResponse
from app.api.deps import get_db
from app.services.auth_service import login_user
from app.utils.security import create_access_token, create_refresh_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
async def login(data: LoginRequest, response: Response, db=Depends(get_db)):
    user = await login_user(db, data.email, data.password)

    access_token = create_access_token(str(user["_id"]))
    refresh_token = create_refresh_token(str(user["_id"]))

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="none",
        secure=True, #change to true during production
        max_age=60 * 15,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="none",
        secure=True, #change to true during production
        max_age=60 * 60 * 24 * 7,
    )

    return {
        "is_setup_completed": user.get("is_setup_completed", False)
    }