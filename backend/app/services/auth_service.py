from fastapi import HTTPException, status
from app.db.user_repo import get_user_by_email
from app.utils.security import hash_password, verify_password
from app.db.user_repo import create_user

async def login_user(db, email: str, password: str) -> str:
    user = await get_user_by_email(db, email)
    
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    return user  # Return user_id, not token


async def register_user(db, email: str, password: str, name: str) -> str:
    existing = await get_user_by_email(db, email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists",
        )
    
    hashed = hash_password(password)
    user = await create_user(db, email, hashed, name)
    
    return str(user["_id"])  # Return user_id, not token