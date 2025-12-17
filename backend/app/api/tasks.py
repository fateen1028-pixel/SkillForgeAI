from fastapi import APIRouter, Depends
from app.api.deps import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/")
async def get_tasks(current_user=Depends(get_current_user)):
    return {
        "message": "Protected tasks",
        "user_id": str(current_user["_id"]),
    }
