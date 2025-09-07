import os, ipaddress, re
from flask import request, abort
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Simple rate limiting: 100 requests per minute per IP
limiter = Limiter(key_func=get_remote_address, default_limits=["100 per minute"])

# Load blocked CIDRs and UAs
BASE_BACKEND = os.path.dirname(os.path.dirname(__file__))
CIDR_FILE = os.path.join(BASE_BACKEND, "blocked", "cidrs.txt")
UA_FILE = os.path.join(BASE_BACKEND, "blocked", "user_agents.txt")

def _load_lines(path):
    if not os.path.exists(path): return []
    with open(path, "r", encoding="utf-8") as f:
        return [l.strip() for l in f if l.strip() and not l.strip().startswith("#")]

_cidrs = [_ for _ in _load_lines(CIDR_FILE)]
BLOCKED_NETS = [ipaddress.ip_network(c) for c in _cidrs if re.match(r".*/\d{1,2}$", c)]

BLOCKED_UA_SUBSTRINGS = [s.lower() for s in _load_lines(UA_FILE)] or [
    "curl", "wget", "httpclient", "python-requests", "nikto", "sqlmap", "nmap",
    "masscan", "scrapy", "libwww", "go-http-client"
]

def ip_in_blocked_nets(ip):
    try:
        ip_obj = ipaddress.ip_address(ip)
        return any(ip_obj in net for net in BLOCKED_NETS)
    except ValueError:
        return False

def bot_filter():
    # Not used directly as middleware, but can be called inside route to enforce
    ip = request.headers.get("X-Forwarded-For", request.remote_addr or "0.0.0.0").split(",")[0].strip()
    ua = request.headers.get("User-Agent", "")
    # User-agent substrings check
    if any(s in ua.lower() for s in BLOCKED_UA_SUBSTRINGS):
        abort(403)
    # Datacenter IP subnet block
    if ip_in_blocked_nets(ip):
        abort(403)
