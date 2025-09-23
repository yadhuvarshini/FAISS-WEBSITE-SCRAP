# app/crawler.py
import logging
import certifi
from typing import List, Set
import time
import requests
from collections import deque
from urllib.robotparser import RobotFileParser
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from app.utils import get_base_url
import urllib3

urllib3.disable_warnings()

USER_AGENT = "Googlebot (compatible; MyCrawler/1.0)"
DEFAULT_TIMEOUT = 8  # seconds
MAX_PAGES = 20  # limit for BFS
SKIP_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".css", ".js", ".ico", ".txt"]

logging.basicConfig(level=logging.INFO)

# ---------------- Robots.txt check ----------------
def allowed_by_robots(url: str) -> bool:
    """Return True if URL is allowed by robots.txt"""
    try:
        robots_url = urljoin(get_base_url(url), "/robots.txt")
        rp = RobotFileParser()
        rp.set_url(robots_url)
        rp.read()
        result = rp.can_fetch(USER_AGENT, url)
        return result if result is not None else True
    except Exception:
        return True  # fail open


# ---------------- Sitemap fetch ----------------
def fetch_sitemap_urls(url: str) -> List[str]:
    if url.lower().endswith(".xml") and "sitemap" in url.lower():
        sitemap_url = url
    else:
        sitemap_url = urljoin(get_base_url(url), "/sitemap.xml")

    urls: List[str] = []
    try:
        r = requests.get(sitemap_url, headers={"User-Agent": USER_AGENT}, timeout=DEFAULT_TIMEOUT, verify=False)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "xml")
            for loc in soup.find_all("loc"):
                text = (loc.text or "").strip()
                if text:
                    urls.append(text)
    except Exception as e:
        print(f"[error] Failed fetching sitemap {sitemap_url}: {e}")
    return urls


# ---------------- URL normalization ----------------
def normalize_url(url: str) -> str:
    """Normalize URL for consistent visited check"""
    parsed = urlparse(url)
    # lowercase scheme/netloc, remove fragment
    return parsed._replace(fragment="").geturl()


# ---------------- BFS Spider ----------------
def spider_bfs(seed_url: str, depth: int = 2, max_pages: int = MAX_PAGES) -> List[str]:

    print("Starting BFS crawl...")
    parsed_seed = urlparse(seed_url)
    domain = parsed_seed.netloc

    visited: Set[str] = set()
    queue = deque([(seed_url, 0)])
    results: List[str] = []

    while queue and len(results) < max_pages:
        url, d = queue.popleft()
        url = normalize_url(url)

        if d > depth or url in visited:
            continue

        visited.add(url)

        # Skip robots.txt and non-HTML resources
        if url.endswith("/robots.txt") or any(url.endswith(ext) for ext in SKIP_EXTENSIONS):
            continue

        if not allowed_by_robots(url):
            continue

        try:
            r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=DEFAULT_TIMEOUT, verify=certifi.where())
            if 200 <= r.status_code < 400:  # accept 2xx and redirects
                results.append(url)
            
            print(f"[crawl] {url} (depth {d})")

            soup = BeautifulSoup(r.text, "lxml")
            for a in soup.find_all("a", href=True):
                nxt = urljoin(url, a["href"].split("#")[0])
                nxt = normalize_url(nxt)
                parsed_nxt = urlparse(nxt)
                if domain in parsed_nxt.netloc and nxt not in visited:
                    queue.append((nxt, d + 1))

            time.sleep(0.2)  # politeness delay
        except Exception as e:
            print(f"[error] Failed fetching {url}: {e}")
            continue

    return results


# ---------------- Main crawler entry ----------------
def crawl_site(url: str, depth: int = 2, use_sitemap: bool = True) -> List[str]:
    """Try sitemap first, fallback to BFS spider"""
    urls: List[str] = []
    if use_sitemap:
        print("step 1: sitemap checked - AVAILABLE")
        urls = fetch_sitemap_urls(url)
    if not urls:
        print("step 1: sitemap checked - UNAVAILABLE")
        urls = spider_bfs(url, depth=depth, max_pages=MAX_PAGES)
        logging.info(f"crawl_task got {len(urls)} URLs: {urls[:5]}")

    return urls