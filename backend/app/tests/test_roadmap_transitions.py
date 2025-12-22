import copy
import pytest
from datetime import datetime, timezone

from app.domain.roadmap_validator import validate_roadmap_state, RoadmapValidationError
from app.domain.roadmap_transitions import start_slot, complete_slot

# ---------------------------
# Mock roadmap
# ---------------------------
def get_mock_roadmap():
    return {
        "_id": "mock1",
        "user_id": "user123",
        "goal": "placement",
        "version": 1,
        "phases": [
            {
                "phase_id": 1,
                "name": "Foundations",
                "phase_status": "active",
                "slots": [
                    {"slot_id": "arrays_easy", "skill": "arrays", "difficulty": "easy", "status": "available"},
                    {"slot_id": "arrays_medium", "skill": "arrays", "difficulty": "medium", "status": "locked"},
                ],
            },
            {
                "phase_id": 2,
                "name": "Intermediate",
                "phase_status": "locked",
                "locked_reason": "Complete Foundations first",
                "slots": [
                    {"slot_id": "linkedlist_easy", "skill": "linkedlist", "difficulty": "easy", "status": "locked"}
                ],
            },
        ],
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "last_evaluated_at": datetime.now(timezone.utc).isoformat(),
        "is_active": True,
    }

# ---------------------------
# Test functions
# ---------------------------
def test_initial_roadmap_valid():
    roadmap = copy.deepcopy(get_mock_roadmap())
    # Should pass validator
    validate_roadmap_state(roadmap)

def test_start_slot_updates_status():
    roadmap = copy.deepcopy(get_mock_roadmap())
    roadmap = start_slot(roadmap, phase_id=1, slot_id="arrays_easy")
    assert roadmap["phases"][0]["slots"][0]["status"] == "in_progress"

def test_complete_slot_updates_status_and_unlocks_next():
    roadmap = copy.deepcopy(get_mock_roadmap())
    roadmap = start_slot(roadmap, phase_id=1, slot_id="arrays_easy")
    roadmap = complete_slot(roadmap, phase_id=1, slot_id="arrays_easy", result="completed")

    # Completed
    assert roadmap["phases"][0]["slots"][0]["status"] == "completed"
    # Next slot unlocked
    assert roadmap["phases"][0]["slots"][1]["status"] == "available"

def test_complete_all_phase1_activates_phase2():
    roadmap = copy.deepcopy(get_mock_roadmap())
    # Complete first slot
    roadmap = start_slot(roadmap, phase_id=1, slot_id="arrays_easy")
    roadmap = complete_slot(roadmap, phase_id=1, slot_id="arrays_easy", result="completed")
    # Complete second slot
    roadmap = start_slot(roadmap, phase_id=1, slot_id="arrays_medium")
    roadmap = complete_slot(roadmap, phase_id=1, slot_id="arrays_medium", result="completed")

    # Phase 1 completed
    assert roadmap["phases"][0]["phase_status"] == "completed"
    # Phase 2 unlocked
    assert roadmap["phases"][1]["phase_status"] == "active"

def test_multiple_in_progress_slots_raises():
    roadmap = copy.deepcopy(get_mock_roadmap())
    roadmap = start_slot(roadmap, phase_id=1, slot_id="arrays_easy")
    # Attempt to start second slot without completing first
    with pytest.raises(Exception):
        start_slot(roadmap, phase_id=1, slot_id="arrays_medium")

def test_locked_slot_cannot_be_started():
    roadmap = copy.deepcopy(get_mock_roadmap())
    # Phase 2 is locked
    with pytest.raises(Exception):
        start_slot(roadmap, phase_id=2, slot_id="linkedlist_easy")

def test_validator_catches_missing_fields():
    roadmap = copy.deepcopy(get_mock_roadmap())
    del roadmap["_id"]
    with pytest.raises(RoadmapValidationError):
        validate_roadmap_state(roadmap)

def test_validator_catches_invalid_slot_status():
    roadmap = copy.deepcopy(get_mock_roadmap())
    roadmap["phases"][0]["slots"][0]["status"] = "broken_status"
    with pytest.raises(RoadmapValidationError):
        validate_roadmap_state(roadmap)
