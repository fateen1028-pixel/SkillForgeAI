from fastapi import APIRouter, Depends, Response, Request
from app.schemas.user import RegisterRequest
from app.api.deps import get_db
from app.services.auth_service import register_user
from app.utils.security import create_access_token, create_refresh_token
from app.core.limiter import limiter
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
@limiter.limit("3/minute")
async def register(
    request: Request,
    data: RegisterRequest,
    response: Response,
    db=Depends(get_db),
):
    user_id = await register_user(db, data.email, data.password, data.name)

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

    return {"message": "Registration successful"}
