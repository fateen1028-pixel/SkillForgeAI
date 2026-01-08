from typing import Any
from app.db.user_repo import get_user_by_email
from app.utils.security import hash_password, verify_password
from app.db.user_repo import create_user
from app.core.exceptions import InvalidCredentialsError, UserAlreadyExistsError

async def login_user(db, email: str, password: str) -> Any:
    user = await get_user_by_email(db, email)
    
    if not user or not verify_password(password, user["password"]):
        raise InvalidCredentialsError("Invalid email or password", detail="INVALID_CREDENTIALS")
    
    return user


async def register_user(db, email: str, password: str, name: str) -> str:
    existing = await get_user_by_email(db, email)
    if existing:
        raise UserAlreadyExistsError(f"User with email {email} already exists", detail="USER_ALREADY_EXISTS")
    
    hashed = hash_password(password)
    user = await create_user(db, email, hashed, name)
    
    return str(user["_id"])
