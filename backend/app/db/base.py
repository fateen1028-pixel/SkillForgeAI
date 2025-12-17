from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

from app.core.config import settings

_client: Optional[AsyncIOMotorClient] = None


def get_client() -> AsyncIOMotorClient:
    global _client

    if _client is None:
        _client = AsyncIOMotorClient(
            settings.MONGO_URI,
            maxPoolSize=settings.MONGO_MAX_POOL_SIZE,
            serverSelectionTimeoutMS=5000,
        )

    return _client


def get_database():
    return get_client()[settings.MONGO_DB_NAME]

def close_client():
    _client.close()