from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from enum import Enum


class GoalType(str, Enum):
    PLACEMENT = "placement"
    JOB_SWITCH = "switch"
    UPSKILL = "upskill"
    INTERNSHIP = "internship"
    UNSPECIFIED = "UNSPECIFIED"


class ExperienceLevel(str, Enum):
    FRESHER = "fresher"
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    EXPERIENCED = "experienced"
    UNSPECIFIED = "UNSPECIFIED"


class TimeAvailability(str, Enum):
    ONE_MONTH = "1-month"
    TWO_MONTHS = "2-months"
    THREE_MONTHS = "3-months"
    SIX_MONTHS = "6-months"
    TWELVE_MONTHS = "12-months"
    UNSPECIFIED = "UNSPECIFIED"


class SkillType(str, Enum):
    DSA = "dsa"
    WEBDEV = "webdev"
    SYSTEM_DESIGN = "system-design"
    DATABASES = "databases"
    OS = "os"
    NETWORKING = "networking"
    OOPS = "oops"
    APTITUDE = "aptitude"


class LanguageType(str, Enum):
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    JAVA = "java"
    CPP = "cpp"
    C = "c"
    TYPESCRIPT = "typescript"
    GO = "go"
    RUST = "rust"
    CSHARP = "csharp"
    KOTLIN = "kotlin"
    SWIFT = "swift"
    PHP = "php"
    RUBY = "ruby"
    SQL = "sql"
    SCALA = "scala"
    DART = "dart"


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
    goal: GoalType = GoalType.UNSPECIFIED
    goals: List[SkillType]
    prior_exposure_languages: List[LanguageType]
    time_availability: TimeAvailability = TimeAvailability.UNSPECIFIED
    experience_level: ExperienceLevel = ExperienceLevel.UNSPECIFIED


class UserSetupResponse(BaseModel):
    message: str
    is_setup_completed: bool