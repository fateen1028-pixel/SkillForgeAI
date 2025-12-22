from app.schemas.roadmap_state import RoadmapState
from datetime import timezone, datetime
from bson import ObjectId


def ensure_utc(dt):
    if isinstance(dt, datetime) and dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


class UserRoadmapRepo:
    def __init__(self, db):
        self.collection = db.user_roadmaps

    @staticmethod
    def _to_domain(doc: dict) -> dict:
        """
        Convert Mongo document → pure domain dict.
        Persistence details must not leak past this point.
        """
        doc = dict(doc)
        doc.pop("_id", None)

        doc["user_id"] = str(doc["user_id"])
        doc["generated_at"] = ensure_utc(doc.get("generated_at"))
        doc["last_evaluated_at"] = ensure_utc(doc.get("last_evaluated_at"))

        return doc

    async def get_active_roadmap(self, user_id: str) -> RoadmapState | None:
        doc = await self.collection.find_one({
            "user_id": str(user_id),
            "is_active": True
        })

        if not doc:
            return None

        domain_dict = self._to_domain(doc)
        return RoadmapState(**domain_dict)

    async def create_roadmap(self, roadmap: RoadmapState | dict):
        """
        Insert roadmap into MongoDB.
        Domain → persistence happens ONLY here.
        """
        if isinstance(roadmap, RoadmapState):
            data = roadmap.dict()
        else:
            data = dict(roadmap)

        data["user_id"] = str(data["user_id"])
        data["is_active"] = True

        await self.collection.insert_one(data)

    async def update_roadmap(self, roadmap: RoadmapState) -> None:
        result = await self.collection.update_one(
            {
                "user_id": roadmap.user_id,
                "is_active": True
            },
            {
                "$set": roadmap.model_dump()
            }
        )

        if result.matched_count != 1:
            raise RuntimeError("Failed to update active roadmap")

