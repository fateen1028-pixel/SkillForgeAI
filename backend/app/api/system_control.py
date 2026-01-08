from fastapi import APIRouter, HTTPException, Depends, Request
from app.core.system_status import system_status
from app.schemas.system_events import SystemEvent
from datetime import datetime
import logging

router = APIRouter(prefix="/system", tags=["System Control"])
logger = logging.getLogger(__name__)

# In a real app, use proper dependency injection for admin check
def verify_admin():
    # Placeholder for admin verification
    return True

@router.post("/freeze")
def freeze_system(reason: str, admin: bool = Depends(verify_admin)):
    """
    Manual override: Freeze the system.
    """
    system_status.transition_to("FROZEN", reason)
    
    event = SystemEvent(
        event_type="SYSTEM_FREEZE",
        severity="critical",
        payload={"reason": reason},
        created_at=datetime.utcnow()
    )
    logger.info(f"System Event: {event.model_dump_json()}")
    
    return {"status": "System FROZEN", "reason": reason}

@router.post("/unfreeze")
def unfreeze_system(reason: str, admin: bool = Depends(verify_admin)):
    """
    Manual override: Unfreeze the system (return to NORMAL).
    """
    system_status.transition_to("NORMAL", reason)
    
    event = SystemEvent(
        event_type="SYSTEM_UNFREEZE",
        severity="warning",
        payload={"reason": reason},
        created_at=datetime.utcnow()
    )
    logger.info(f"System Event: {event.model_dump_json()}")

    return {"status": "System NORMAL", "reason": reason}

@router.post("/set-dampening")
def set_dampening(factor: float, reason: str, admin: bool = Depends(verify_admin)):
    """
    Manual override: Set dampening factor.
    """
    if not 0.0 <= factor <= 1.0:
        raise HTTPException(status_code=400, detail="Factor must be between 0.0 and 1.0")
        
    system_status.transition_to("DAMPENED", reason, dampening_factor=factor)
    
    event = SystemEvent(
        event_type="MANUAL_DAMPENING",
        severity="warning",
        payload={"reason": reason, "factor": factor},
        created_at=datetime.utcnow()
    )
    logger.info(f"System Event: {event.model_dump_json()}")

    return {"status": "System DAMPENED", "factor": factor, "reason": reason}

@router.get("/status")
async def get_system_status(request: Request):
    db_ok = False
    try:
        # Ping the database
        await request.app.state.db.command("ping")
        db_ok = True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")

    return {
        "system": system_status.status,
        "database": "connected" if db_ok else "disconnected",
        "timestamp": datetime.utcnow()
    }
