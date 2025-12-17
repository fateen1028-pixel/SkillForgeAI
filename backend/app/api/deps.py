from fastapi import Depends, Cookie, HTTPException, status
from app.utils.security import decode_access_token,decode_token
from app.db.user_repo import get_user_by_id
from app.db.base import get_database
import jwt

async def get_current_user(
    access_token: str | None = Cookie(default=None),
):
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="NO_TOKEN",
        )

    try:
        user_id = decode_token(access_token, expected_type="access")
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ACCESS_TOKEN_EXPIRED",
        )

    db = get_database()
    user = await get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="USER_NOT_FOUND",
        )

    return user


def get_db():
    return get_database()

