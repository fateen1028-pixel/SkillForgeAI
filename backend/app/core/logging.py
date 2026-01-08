import logging
import sys
import json
from datetime import datetime
from app.core.config import settings

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "name": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_record)

def setup_logging():
    """
    Configure the logging for the application.
    """
    log_level = settings.LOG_LEVEL.upper()
    numeric_level = getattr(logging, log_level, logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    if settings.ENVIRONMENT.lower() == "production":
        handler.setFormatter(JsonFormatter())
    else:
        # Standard format for development
        formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
        handler.setFormatter(formatter)

    # Clear existing handlers
    root_logger = logging.getLogger()
    for h in root_logger.handlers[:]:
        root_logger.removeHandler(h)
    
    root_logger.addHandler(handler)
    root_logger.setLevel(numeric_level)

    # Set lower log level for third-party libraries if needed
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    
    logger = logging.getLogger("skillforge")
    logger.info(f"Logging initialized at level {log_level} in {settings.ENVIRONMENT} mode")
