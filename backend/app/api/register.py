from fastapi import APIRouter, Depends, Response,HTTPException
from app.schemas.user import RegisterRequest
from app.api.deps import get_db
from app.services.auth_service import register_user
from app.utils.security import create_access_token, create_refresh_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(
    data: RegisterRequest,
    response: Response,
    db=Depends(get_db),
):
    try:
        user_id = await register_user(db, data.email, data.password, data.name)

        if not user_id:
            raise HTTPException(status_code=400, detail="User registration failed")

        access_token = create_access_token(user_id)
        refresh_token = create_refresh_token(user_id)

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            samesite="none", secure=True,
            max_age=60 * 15,
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            samesite="none", secure=True,
            max_age=60 * 60 * 24 * 7,
        )

        return {"message": "Registration successful"}
    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        print(f"Error during registration: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

