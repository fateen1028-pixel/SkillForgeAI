from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.diagnose import router as diagnose_router
from app.api.login import router as login_router
from app.api.tasks import router as tasks_router
from app.api.register import router as register_router
from app.api.users import router as users_router
from app.db.base import close_client
# from app.api.roadmap import router as roadmap_router
from contextlib import asynccontextmanager



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown
    await close_client()

app = FastAPI(title="SkillForge AI Backend",lifespan=lifespan)

app.include_router(diagnose_router)
app.include_router(login_router)
app.include_router(register_router)
app.include_router(tasks_router)
app.include_router(users_router,prefix="/api",tags=["users"])
# app.include_router(roadmap_router, prefix="/roadmap", tags=["Roadmap"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


