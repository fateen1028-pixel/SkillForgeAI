from fastapi import APIRouter, Cookie, Response, HTTPException
from app.utils.security import decode_token, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/refresh")
async def refresh_token(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    user_id = decode_token(refresh_token, expected_type="refresh")
    new_access_token = create_access_token(user_id)

    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        samesite="lax",
        max_age=60 * 15,
    )

    return {"message": "Token refreshed"}
