from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.diagnose import router as diagnose_router
from app.api.login import router as login_router
from app.api.logout import router as logout_router
from app.api.tasks import router as tasks_router
from app.api.register import router as register_router
from app.api.users import router as users_router
from app.db.base import close_client,get_database
from contextlib import asynccontextmanager
from app.api.roadmap import router as roadmap_router
from app.api.roadmap_slot import router as roadmap_slot_router
from app.api.submissions import router as submissions_router
from app.api.learning_state import router as learning_state_router
from app.api.system_control import router as system_control_router
from app.core.config import settings
from app.core.logging import setup_logging
from app.core.limiter import limiter
from app.domain.task_template_loader import _ensure_loaded
from fastapi.responses import JSONResponse
from fastapi import Request, status
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.exceptions import (
    AuthError, 
    InvalidCredentialsError, 
    UserAlreadyExistsError, 
    TokenExpiredError, 
    InvalidTokenError
)
import logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up application...")
    app.state.db = get_database()
    
    # Eagerly load all task templates
    try:
        _ensure_loaded()
        logger.info("Task templates loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load task templates: {e}")
        
    yield
    # Shutdown
    logger.info("Shutting down application...")
    close_client()

app = FastAPI(title="SkillForge AI Backend",lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.exception_handler(InvalidCredentialsError)
async def invalid_credentials_handler(request: Request, exc: InvalidCredentialsError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"message": exc.message, "code": exc.detail or "INVALID_CREDENTIALS"},
    )

@app.exception_handler(UserAlreadyExistsError)
async def user_exists_handler(request: Request, exc: UserAlreadyExistsError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"message": exc.message, "code": "USER_ALREADY_EXISTS"},
    )

@app.exception_handler(TokenExpiredError)
async def token_expired_handler(request: Request, exc: TokenExpiredError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"message": exc.message, "code": exc.detail or "TOKEN_EXPIRED"},
    )

@app.exception_handler(InvalidTokenError)
async def invalid_token_handler(request: Request, exc: InvalidTokenError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"message": exc.message, "code": exc.detail or "INVALID_TOKEN"},
    )

@app.exception_handler(AuthError)
async def auth_error_handler(request: Request, exc: AuthError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"message": exc.message, "code": exc.detail or "AUTH_ERROR"},
    )

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "code": "INTERNAL_SERVER_ERROR"},
    )

app.include_router(diagnose_router)
app.include_router(login_router)
app.include_router(logout_router)
app.include_router(register_router)
app.include_router(tasks_router)
app.include_router(users_router,prefix="/api",tags=["users"])
app.include_router(roadmap_router)
app.include_router(roadmap_slot_router)
app.include_router(submissions_router)
app.include_router(learning_state_router)
app.include_router(system_control_router)



app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


