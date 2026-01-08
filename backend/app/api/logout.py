from fastapi import APIRouter, Response
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/logout")
async def logout(response: Response):
    is_prod = settings.ENVIRONMENT.lower() == "production"
    
    response.delete_cookie(
        "access_token", 
        httponly=True, 
        samesite="lax" if not is_prod else "none",
        secure=is_prod
    )
    response.delete_cookie(
        "refresh_token", 
        httponly=True, 
        samesite="lax" if not is_prod else "none",
        secure=is_prod
    )

    return {"message": "Logged out"}
