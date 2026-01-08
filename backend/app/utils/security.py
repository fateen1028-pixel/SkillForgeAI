from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import jwt
from app.core.config import settings
from app.core.exceptions import TokenExpiredError, InvalidTokenError


ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


def hash_password(password: str) -> str:
    # Truncate password to 72 bytes to avoid bcrypt error
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    return pwd_context.hash(password_bytes.decode('utf-8', 'ignore'))


def decode_access_token(token: str) -> str:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=["HS256"],
        )
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise TokenExpiredError("Access token has expired", detail="ACCESS_TOKEN_EXPIRED")
    except jwt.InvalidTokenError:
        raise InvalidTokenError("Invalid access token", detail="INVALID_ACCESS_TOKEN")
def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "type": "refresh",
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


def decode_token(token: str, expected_type: str) -> str:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=["HS256"],
        )

        if payload.get("type") != expected_type:
            raise InvalidTokenError(f"Expected {expected_type} token, got {payload.get('type')}", detail="INVALID_TOKEN_TYPE")

        return payload["sub"]

    except jwt.ExpiredSignatureError:
        raise TokenExpiredError(f"{expected_type.capitalize()} token has expired", detail=f"{expected_type.upper()}_TOKEN_EXPIRED")
    except jwt.InvalidTokenError:
        raise InvalidTokenError(f"Invalid {expected_type} token", detail=f"INVALID_{expected_type.upper()}_TOKEN")
