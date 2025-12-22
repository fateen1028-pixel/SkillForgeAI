# app/api/roadmap_slot.py

from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user, get_user_roadmap_repo
from app.db.user_roadmap_repo import UserRoadmapRepo
from app.domain.roadmap_validator import validate_roadmap_state, RoadmapValidationError
from app.services.ai_services import AIService

router = APIRouter(
    prefix="/roadmap/slot",
    tags=["roadmap_slot"]
)

ai_service = AIService()


async def _get_active_roadmap_dict(current_user: dict, repo: UserRoadmapRepo) -> dict:
    roadmap = await repo.get_active_roadmap(str(current_user["_id"]))
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not initialized")
    return roadmap


# ---------------------------
# START SLOT
# ---------------------------
@router.post("/start")
async def start_slot(
    slot_id: str,
    current_user: dict = Depends(get_current_user),
    repo: UserRoadmapRepo = Depends(get_user_roadmap_repo)
):
    roadmap = await _get_active_roadmap_dict(current_user, repo)

    slot_found = None
    for phase in roadmap["phases"]:
        if phase["phase_status"] != "active":
            continue
        for slot in phase.get("slots", []):
            if slot["slot_id"] == slot_id:
                if slot["status"] != "available":
                    raise HTTPException(status_code=400, detail=f"Slot {slot_id} cannot be started (status: {slot['status']})")
                slot["status"] = "in_progress"
                slot_found = slot
                break
        if slot_found:
            break

    if not slot_found:
        raise HTTPException(status_code=404, detail=f"Slot {slot_id} not found in active phase")

    # Validate and save
    try:
        validate_roadmap_state(roadmap)
    except RoadmapValidationError as e:
        raise HTTPException(status_code=500, detail=f"Roadmap corrupted: {e}")

    await repo.update_roadmap(roadmap["_id"], {"phases": roadmap["phases"]})

    hint = await ai_service.generate_hint(slot_found, current_user.get("skill_vector", {}))

    return {"message": f"Slot {slot_id} started successfully", "hint": hint, "roadmap": roadmap}


# ---------------------------
# COMPLETE SLOT
# ---------------------------
@router.post("/complete")
async def complete_slot(
    slot_id: str,
    success: bool = True,
    current_user: dict = Depends(get_current_user),
    repo: UserRoadmapRepo = Depends(get_user_roadmap_repo)
):
    roadmap = await _get_active_roadmap_dict(current_user, repo)

    slot_found = None
    active_phase = None
    for phase in roadmap["phases"]:
        if phase["phase_status"] != "active":
            continue
        active_phase = phase
        for slot in phase.get("slots", []):
            if slot["slot_id"] == slot_id:
                if slot["status"] != "in_progress":
                    raise HTTPException(status_code=400, detail=f"Slot {slot_id} cannot be completed (status: {slot['status']})")
                slot["status"] = "completed" if success else "failed"
                slot_found = slot
                break
        if slot_found:
            break

    if not slot_found:
        raise HTTPException(status_code=404, detail=f"Slot {slot_id} not found in active phase")

    # Update SkillVector and adjust difficulty
    skill_vector = current_user.get("skill_vector", {})
    skill_vector = await ai_service.update_skill_vector(skill_vector, slot_found, success)
    current_user["skill_vector"] = skill_vector

    for phase in roadmap["phases"]:
        for slot in phase.get("slots", []):
            if slot["status"] == "available":
                slot["difficulty"] = await ai_service.adjust_slot_difficulty(slot, skill_vector)

    # Complete phase if all slots done
    if all(s["status"] in ["completed", "failed", "remediation_required"] for s in active_phase["slots"]):
        active_phase["phase_status"] = "completed"
        for phase in roadmap["phases"]:
            if phase["phase_status"] == "locked":
                phase["phase_status"] = "active"
                phase["locked_reason"] = None
                break

    try:
        validate_roadmap_state(roadmap)
    except RoadmapValidationError as e:
        raise HTTPException(status_code=500, detail=f"Roadmap corrupted: {e}")

    await repo.update_roadmap(roadmap["_id"], {"phases": roadmap["phases"], "current_phase": roadmap.get("current_phase")})

    return {"message": f"Slot {slot_id} {'completed' if success else 'failed'} successfully",
            "roadmap": roadmap, "skill_vector": skill_vector}


# ---------------------------
# REMEDIATE SLOT
# ---------------------------
@router.post("/remediate")
async def remediate_slot(
    slot_id: str,
    current_user: dict = Depends(get_current_user),
    repo: UserRoadmapRepo = Depends(get_user_roadmap_repo)
):
    roadmap = await _get_active_roadmap_dict(current_user, repo)

    slot_found = None
    for phase in roadmap["phases"]:
        for slot in phase.get("slots", []):
            if slot["slot_id"] == slot_id:
                slot["status"] = "remediation_required"
                slot_found = slot
                break
        if slot_found:
            break

    if not slot_found:
        raise HTTPException(status_code=404, detail=f"Slot {slot_id} not found")

    try:
        validate_roadmap_state(roadmap)
    except RoadmapValidationError as e:
        raise HTTPException(status_code=500, detail=f"Roadmap corrupted: {e}")

    await repo.update_roadmap(roadmap["_id"], {"phases": roadmap["phases"]})

    return {"message": f"Slot {slot_id} marked for remediation", "roadmap": roadmap}
