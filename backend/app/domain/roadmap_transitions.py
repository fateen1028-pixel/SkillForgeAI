from typing import Dict, Optional
from app.domain.roadmap_validator import validate_roadmap_state, RoadmapValidationError


class RoadmapTransitionError(Exception):
    """Raised when a roadmap transition is invalid."""
    pass



def start_slot(roadmap: Dict, phase_id: int, slot_id: str) -> Dict:
    """
    Safely mark a slot as 'in_progress'.
    
    Rules:
    - Only one in_progress slot per roadmap at any time.
    - Slot must be 'available'.
    - Phase must be active.
    """

    # 1️⃣ Check for existing in_progress slots
    for phase in roadmap["phases"]:
        for slot in phase.get("slots", []):
            if slot["status"] == "in_progress":
                raise RoadmapTransitionError(f"Slot {slot['slot_id']} is already in_progress; cannot start another slot")

    # 2️⃣ Find the target phase
    phase = next((p for p in roadmap["phases"] if p["phase_id"] == phase_id), None)
    if not phase:
        raise RoadmapTransitionError(f"Phase {phase_id} not found")

    if phase["phase_status"] != "active":
        raise RoadmapTransitionError(f"Phase {phase_id} is not active")

    # 3️⃣ Find the target slot
    slot = next((s for s in phase.get("slots", []) if s["slot_id"] == slot_id), None)
    if not slot:
        raise RoadmapTransitionError(f"Slot {slot_id} not found in phase {phase_id}")

    if slot["status"] != "available":
        raise RoadmapTransitionError(f"Slot {slot_id} must be 'available' to start, current status: {slot['status']}")

    # 4️⃣ Mark slot as in_progress
    slot["status"] = "in_progress"

    # 5️⃣ Re-validate roadmap
    try:
        validate_roadmap_state(roadmap)
    except RoadmapValidationError as e:
        raise RoadmapTransitionError(f"Roadmap invalid after starting slot: {e}")

    return roadmap


def complete_slot(roadmap: Dict, phase_id: int, slot_id: str, result: str) -> Dict:
    """
    Mark a slot as completed or failed, unlock next slot/phase if applicable.
    """

    if result not in ["completed", "failed"]:
        raise RoadmapTransitionError("Result must be 'completed' or 'failed'")

    # Find the target phase
    phase = next((p for p in roadmap["phases"] if p["phase_id"] == phase_id), None)
    if not phase:
        raise RoadmapTransitionError(f"Phase {phase_id} not found")

    if phase["phase_status"] != "active":
        raise RoadmapTransitionError(f"Phase {phase_id} is not active")

    # Find the target slot
    slot = next((s for s in phase["slots"] if s["slot_id"] == slot_id), None)
    if not slot:
        raise RoadmapTransitionError(f"Slot {slot_id} not found in phase {phase_id}")

    if slot["status"] != "in_progress" and slot["status"] != "available":
        raise RoadmapTransitionError(f"Slot {slot_id} cannot be completed from status {slot['status']}")

    # Update the slot status
    slot["status"] = result

    # Unlock next slot in the same phase
    slots = phase["slots"]
    unlocked = False
    for s in slots:
        if s["status"] == "locked":
            s["status"] = "available"
            unlocked = True
            break

    # If no slots left to unlock, complete phase and unlock next phase
    if not unlocked:
        phase["phase_status"] = "completed"

        # Unlock next phase
        phases = roadmap["phases"]
        current_index = phases.index(phase)
        if current_index + 1 < len(phases):
            next_phase = phases[current_index + 1]
            next_phase["phase_status"] = "active"
            # Unlock first slot in the new phase
            if next_phase.get("slots"):
                next_phase["slots"][0]["status"] = "available"

    # Re-validate roadmap
    try:
        validate_roadmap_state(roadmap)
    except RoadmapValidationError as e:
        raise RoadmapTransitionError(f"Roadmap invalid after transition: {e}")

    return roadmap
