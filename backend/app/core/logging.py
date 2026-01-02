import logging
import sys
from app.core.config import settings

def setup_logging():
    """
    Configure the logging for the application.
    """
    log_level = settings.LOG_LEVEL.upper()
    numeric_level = getattr(logging, log_level, logging.INFO)

    logging.basicConfig(
        level=numeric_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )

    # Set lower log level for third-party libraries if needed
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    
    logger = logging.getLogger("skillforge")
    logger.info(f"Logging initialized at level {log_level}")
