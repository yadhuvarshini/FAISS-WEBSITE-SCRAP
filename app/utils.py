import requests
from ast import Set
from collections import deque
import urllib
from urllib.parse import urljoin,urlparse
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

USER_AGENT = "SAMPLE_SELF_TASK_crawler/0.1 (+https://yadhuvarshini.wordpress.com; mailto:yadhuvarshini1@gmail.com)"
DEFAULT_TIMEOUT = 8
HEADERS = {"User-Agent": USER_AGENT}


def get_base_url(url:str) -> str:
    if "://" not in url:
        url = "https://" + url
    p = urlparse(url)
    return f"{p.scheme}://{p.netloc}"

def _safe_head(url: str) -> requests.Response | None:
    try:
        return requests.head(url, headers=HEADERS, timeout=(5, 10), allow_redirects=True)
    except Exception:
        return None

def _safe_get(url: str) -> requests.Response | None:
    try:
        return requests.get(url, headers=HEADERS, timeout=(5, 15), allow_redirects=True)
    except Exception:
        return None

def discover_sitemaps(start_url: str) -> list[str]:
    base = get_base_url(start_url)
    candidates = [
        urljoin(base, "sitemap.xml"),
        urljoin(base, "sitemap_index.xml"),
        urljoin(base, "/sitemap.xml"),
        urljoin(base, "/sitemap_index.xml"),
    ]
    found: list[str] = []

    # 1) robots.txt Sitemap entries
    robots = _safe_get(urljoin(base, "/robots.txt"))
    if robots and robots.ok and robots.text:
        for line in robots.text.splitlines():
            if line.lower().startswith("sitemap:"):
                sm_url = line.split(":", 1)[1].strip()
                found.append(sm_url)

    # 2) Probe common locations
    for u in candidates:
        if u in found:
            continue
        resp = _safe_head(u)
        if resp and resp.ok:
            found.append(u)
            continue
        # Some servers don't implement HEAD well
        resp = _safe_get(u)
        if resp and resp.ok:
            ctype = resp.headers.get("Content-Type", "").lower()
            if "xml" in ctype or "text" in ctype:
                found.append(u)

    # De-duplicate while preserving order
    seen = set()
    uniq = []
    for u in found:
        if u not in seen:
            uniq.append(u)
            seen.add(u)
    return uniq



session = requests.Session()
retries = Retry(total=3, backoff_factor=1, status_forcelist=[500, 502, 503, 504])
session.mount("https://", HTTPAdapter(max_retries=retries))