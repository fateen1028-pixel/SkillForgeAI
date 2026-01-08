# app/api/login.py
from fastapi import APIRouter, Depends, Response, Request
from app.schemas.user import LoginRequest
from app.api.deps import get_db
from app.services.auth_service import login_user
from app.utils.security import create_access_token, create_refresh_token
from app.core.limiter import limiter
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
@limiter.limit("5/minute")
async def login(request: Request, data: LoginRequest, response: Response, db=Depends(get_db)):
    user = await login_user(db, data.email, data.password)
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)

    is_prod = settings.ENVIRONMENT.lower() == "production"

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax" if not is_prod else "none",
        secure=is_prod,
        max_age=60 * 15,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax" if not is_prod else "none",
        secure=is_prod,
        max_age=60 * 60 * 24 * 7,
    )

    return {
        "is_setup_completed": user.get("is_setup_completed", False)
    }