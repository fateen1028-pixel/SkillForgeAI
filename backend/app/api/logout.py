from fastapi import APIRouter, Response

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return {"message": "Logged out"}
