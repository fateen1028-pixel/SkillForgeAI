from fastapi import Depends, Cookie, Request
from app.utils.security import decode_token
from app.db.user_repo import get_user_by_id
from app.db.base import get_database
from app.db.user_roadmap_repo import UserRoadmapRepo
from app.db.task_submission_repo import TaskSubmissionRepo
from app.core.exceptions import InvalidTokenError


async def get_db():
    return get_database()


async def get_current_user(
    access_token: str | None = Cookie(default=None),
    db = Depends(get_db),
):
    if not access_token:
        raise InvalidTokenError("Missing access token", detail="NO_TOKEN")

    user_id = decode_token(access_token, expected_type="access")
    user = await get_user_by_id(db, user_id)

    if not user:
        raise InvalidTokenError("User not found", detail="USER_NOT_FOUND")

    return user



def get_user_roadmap_repo(db = Depends(get_db)):
    return UserRoadmapRepo(db)

def get_task_submission_repo(request: Request):
    return TaskSubmissionRepo(request.app.state.db)