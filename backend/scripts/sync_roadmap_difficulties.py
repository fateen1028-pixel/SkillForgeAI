import asyncio
import os
import sys
from pathlib import Path

# Add the parent directory to sys.path to allow importing from 'app'
sys.path.append(str(Path(__file__).resolve().parent.parent))

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.services.curriculum_service import CurriculumService
from app.db.base import get_database

async def sync_roadmap_difficulties():
    """
    Syncs the difficulty of slots in all user roadmaps with the latest 
    values defined in the curriculum YAML files.
    """
    db = get_database()
    collection = db.user_roadmaps
    
    # Track updated roadmaps
    updated_count = 0
    
    # 1. Get the curriculum (currently defaulting to 'dsa')
    try:
        curriculum = CurriculumService.get_curriculum("dsa")
    except Exception as e:
        print(f"Error loading curriculum: {e}")
        return

    # Create a mapping of slot_id -> difficulty
    difficulty_map = {}
    for phase_def in curriculum.phases:
        for slot_def in phase_def.slots:
            difficulty_map[slot_def.id] = slot_def.difficulty

    # 2. Iterate through all active roadmaps
    async for roadmap in collection.find({"is_active": True}):
        needs_update = False
        
        for phase in roadmap.get("phases", []):
            for slot in phase.get("slots", []):
                slot_id = slot.get("slot_id")
                target_difficulty = difficulty_map.get(slot_id)
                
                if target_difficulty and slot.get("difficulty") != target_difficulty:
                    slot["difficulty"] = target_difficulty
                    needs_update = True
        
        if needs_update:
            # Update the roadmap in DB
            result = await collection.replace_one({"_id": roadmap["_id"]}, roadmap)
            if result.modified_count > 0:
                print(f"Updated roadmap for user {roadmap.get('user_id')}")
                updated_count += 1

    print(f"Finished. Total roadmaps updated: {updated_count}")

if __name__ == "__main__":
    asyncio.run(sync_roadmap_difficulties())
