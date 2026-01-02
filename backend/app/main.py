from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.diagnose import router as diagnose_router
from app.api.login import router as login_router
from app.api.tasks import router as tasks_router
from app.api.register import router as register_router
from app.api.users import router as users_router
from app.db.base import close_client,get_database
from contextlib import asynccontextmanager
from app.api.roadmap import router as roadmap_router
from app.api.roadmap_slot import router as roadmap_slot_router
from app.api.slots import router as slots_router
from app.api import submissions
from app.core.config import settings
from app.core.logging import setup_logging
from fastapi.responses import JSONResponse
from fastapi import Request
import logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up application...")
    app.state.db = get_database()
    yield
    # Shutdown
    logger.info("Shutting down application...")
    close_client()

app = FastAPI(title="SkillForge AI Backend",lifespan=lifespan)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "details": str(exc)},
    )

app.include_router(diagnose_router)
app.include_router(login_router)
app.include_router(register_router)
app.include_router(tasks_router)
app.include_router(users_router,prefix="/api",tags=["users"])
app.include_router(roadmap_router)
app.include_router(roadmap_slot_router)
app.include_router(slots_router, prefix="/roadmap", tags=["slots"])
app.include_router(submissions.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


