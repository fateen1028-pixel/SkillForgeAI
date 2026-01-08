from fastapi import APIRouter, Cookie, Response, Request
from app.utils.security import decode_token, create_access_token
from app.core.exceptions import InvalidTokenError
from app.core.limiter import limiter
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/refresh")
@limiter.limit("10/minute")
async def refresh_token(
    request: Request,
    response: Response,
    refresh_token: str | None = Cookie(default=None),
):
    if not refresh_token:
        raise InvalidTokenError("Missing refresh token", detail="MISSING_REFRESH_TOKEN")

    user_id = decode_token(refresh_token, expected_type="refresh")
    new_access_token = create_access_token(user_id)

    is_prod = settings.ENVIRONMENT.lower() == "production"

    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        samesite="lax" if not is_prod else "none",
        secure=is_prod,
        max_age=60 * 15,
    )

    return {"message": "Token refreshed"}
