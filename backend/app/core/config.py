from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGO_URI: str
    MONGO_DB_NAME: str
    MONGO_MAX_POOL_SIZE: int = 10
    JWT_SECRET: str 
    
    # App Settings
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    LOG_LEVEL: str = "INFO"
    
    # AI Settings
    GEMINI_MODEL: str = "gemini-2.0-flash"
    GOOGLE_API_KEY: str | None = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra='allow'



settings = Settings()
