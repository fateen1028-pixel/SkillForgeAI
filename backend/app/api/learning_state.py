from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user, get_db
from app.services import learning_state_service
from app.schemas.learning_state import UserLearningState

router = APIRouter(prefix="/learning_state", tags=["learning_state"])

@router.post("/init")
async def init_learning_state(
    roadmap_id: str = None,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    return await learning_state_service.create_initial_learning_state(
        db=db,
        user_id=str(current_user["_id"]),
        roadmap_id=roadmap_id
    )

@router.get("/")
async def get_learning_state(
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    return await learning_state_service.get_learning_state(
        db=db,
        user_id=str(current_user["_id"])
    )

@router.patch("/")
async def update_learning_state(
    update_data: dict,
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    return await learning_state_service.update_learning_state(
        db=db,
        user_id=str(current_user["_id"]),
        update_data=update_data
    )
