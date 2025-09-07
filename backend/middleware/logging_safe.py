import os, logging
from logging.handlers import RotatingFileHandler
from flask import request
from utils.crypto import hash_ip

logger = logging.getLogger("access")
logger.setLevel(logging.INFO)
log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "logs")
os.makedirs(log_dir, exist_ok=True)
handler = RotatingFileHandler(os.path.join(log_dir, "access.log"), maxBytes=1_000_000, backupCount=5, encoding="utf-8")
formatter = logging.Formatter("%(asctime)s | %(message)s")
handler.setFormatter(formatter)
if not logger.handlers:
    logger.addHandler(handler)

def logging_safe():
    ip = request.headers.get("X-Forwarded-For", request.remote_addr or "0.0.0.0").split(",")[0].strip()
    token = hash_ip(ip)
    # DO NOT log raw IP or PII
    ua = request.headers.get("User-Agent", "-")[:200]
    path = request.path
    method = request.method
    logger.info(f"{token} | {method} {path} | UA={ua}")
