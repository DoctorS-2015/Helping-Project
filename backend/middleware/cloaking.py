import os, re, ipaddress
from flask import request
from .bot_filter import ip_in_blocked_nets

# Very simple bot detection lists
SEARCH_BOTS = [
    "Googlebot", "Bingbot", "DuckDuckBot", "YandexBot", "Baiduspider"
]
SUSPECT_BOTS = [
    "curl", "wget", "python-requests", "scrapy", "httpclient", "go-http-client"
]

def is_search_bot(ua: str) -> bool:
    return any(b.lower() in ua.lower() for b in SEARCH_BOTS)

def is_suspect(ua: str) -> bool:
    return any(b.lower() in ua.lower() for b in SUSPECT_BOTS)

def decide_variant(req):
    ip = req.headers.get("X-Forwarded-For", req.remote_addr or "0.0.0.0").split(",")[0].strip()
    ua = req.headers.get("User-Agent", "")

    # Block outright if IP is from blocked nets or UA clearly malicious
    if ip_in_blocked_nets(ip) or "sqlmap" in ua.lower():
        return "block"

    # If known search bot, serve bot variant (clean)
    if is_search_bot(ua):
        return "bot"

    # If suspicious user-agent, serve neutral page (treated as block here)
    if is_suspect(ua):
        return "block"

    # Default: human
    return "human"
