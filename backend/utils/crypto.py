import os, hashlib

def hash_ip(ip: str) -> str:
    # Salt from env var to avoid rainbow-table attacks
    salt = os.environ.get("LOG_SALT", "dev-only-salt-change-me")
    digest = hashlib.sha256((salt + ip).encode("utf-8")).hexdigest()
    return digest[:16]  # short token for logs
