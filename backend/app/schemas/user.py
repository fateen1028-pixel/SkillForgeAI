from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from enum import Enum


class GoalType(str, Enum):
    GET_JOB = "get_job"
    LEARN_BACKEND = "learn_backend"
    LEARN_FRONTEND = "learn_frontend"
    COMPETITIVE_PROGRAMMING = "competitive_programming"
    FULL_STACK = "full_stack"


class ExperienceLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    message: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=72)
    name: str


class UserSetupRequest(BaseModel):
    goal: str
    skills: List[str]
    languages: List[str]
    time_availability: str
    experience_level: str


class UserSetupResponse(BaseModel):
    message: str
    is_setup_completed: bool