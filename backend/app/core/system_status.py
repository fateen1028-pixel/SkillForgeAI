
from datetime import datetime
from typing import Literal
from pydantic import BaseModel

class SystemStatus(BaseModel):
    mode: Literal[
        "NORMAL",
        "DAMPENED",
        "SAFE_MODE",
        "FROZEN"
    ]

    dampening_factor: float  # 0.0–1.0
    reason: str

    entered_at: datetime
    last_checked_at: datetime

class SystemStateManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SystemStateManager, cls).__new__(cls)
            cls._instance._status = SystemStatus(
                mode="NORMAL",
                dampening_factor=1.0,
                reason="System startup",
                entered_at=datetime.utcnow(),
                last_checked_at=datetime.utcnow()
            )
            cls._instance.consecutive_passes = 0
        return cls._instance

    @property
    def status(self) -> SystemStatus:
        return self._status

    def transition_to(self, mode: str, reason: str, dampening_factor: float = None):
        current = self._status
        new_dampening = dampening_factor if dampening_factor is not None else current.dampening_factor
        
        if mode == "NORMAL":
            new_dampening = 1.0
        elif mode == "FROZEN":
            new_dampening = 0.0
            
        self._status = SystemStatus(
            mode=mode,
            dampening_factor=new_dampening,
            reason=reason,
            entered_at=datetime.utcnow(),
            last_checked_at=datetime.utcnow()
        )

    # Backward compatibility
    @property
    def is_frozen(self) -> bool:
        return self.status.mode == "FROZEN"

    @property
    def dampening_factor(self) -> float:
        return self.status.dampening_factor

    def set_freeze(self, frozen: bool):
        if frozen:
            self.transition_to("FROZEN", "Manual freeze via set_freeze")
        else:
            self.transition_to("NORMAL", "Manual unfreeze via set_freeze")

    def set_dampening(self, factor: float):
        self.transition_to("DAMPENED", "Manual dampening via set_dampening", dampening_factor=factor)
        
    def increment_passes(self):
        self.consecutive_passes += 1
        
    def reset_passes(self):
        self.consecutive_passes = 0
        
    def get_passes(self) -> int:
        return self.consecutive_passes

system_status = SystemStateManager()
