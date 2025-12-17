from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGO_URI: str
    MONGO_DB_NAME: str
    MONGO_MAX_POOL_SIZE: int = 10
    JWT_SECRET: str 

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra='allow'



settings = Settings()
