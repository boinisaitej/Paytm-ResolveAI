"""Structured JSON logging configuration with automated credential and secret masking."""

import json
import logging
import re
import sys
from datetime import datetime, timezone
from typing import Any, Dict


# Regex patterns to detect and mask credentials or sensitive tokens
SENSITIVE_PATTERNS = [
    (re.compile(r'(?i)Authorization\s*[:=]\s*Bearer\s+[A-Za-z0-9\-_\.=]+'), 'Authorization: Bearer [REDACTED]'),
    (re.compile(r'(?i)Bearer\s+[A-Za-z0-9\-_\.=]+'), 'Bearer [REDACTED]'),
    (re.compile(r'(?i)(api[_-]?key|password|pwd|secret|token)\s*[:=]\s*["\']?([^"\'\s,]+)["\']?'), r'\1="[REDACTED]"'),
    (re.compile(r'(?i)(authorization)\s*[:=]\s*["\']?(?!Bearer)([^"\'\s,]+)["\']?'), r'\1="[REDACTED]"'),
]


def mask_sensitive_data(text: str) -> str:
    """Masks secrets, passwords, and tokens in log strings."""
    if not isinstance(text, str):
        return text
    for pattern, replacement in SENSITIVE_PATTERNS:
        text = pattern.sub(replacement, text)
    return text


class StructuredJsonFormatter(logging.Formatter):
    """Custom JSON formatter producing uniform structured log lines for Azure Log Analytics."""

    def format(self, record: logging.LogRecord) -> str:
        log_entry: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": mask_sensitive_data(record.getMessage()),
            "module": record.module,
            "line": record.lineno,
        }

        # Include exception trace if present
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)

        # Include custom extra fields if provided
        for key, val in record.__dict__.items():
            if key not in ("args", "asctime", "created", "exc_info", "exc_text", "filename",
                           "funcName", "levelname", "levelno", "lineno", "module", "msecs",
                           "message", "msg", "name", "pathname", "process", "processName",
                           "relativeCreated", "stack_info", "thread", "threadName"):
                log_entry[key] = mask_sensitive_data(str(val)) if isinstance(val, str) else val

        return json.dumps(log_entry, default=str)


def setup_logging(log_level: str = "INFO") -> logging.Logger:
    """Initializes root structured JSON logging."""
    logger = logging.getLogger("paytm_resolveai")
    logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))

    # Remove existing handlers to avoid duplicate log entries
    logger.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(StructuredJsonFormatter())
    logger.addHandler(handler)

    # Suppress verbose third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("azure.core.pipeline.policies.http_logging_policy").setLevel(logging.WARNING)

    return logger


logger = setup_logging()
