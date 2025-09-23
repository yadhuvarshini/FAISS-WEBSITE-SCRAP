# app/extractor.py
from bs4 import BeautifulSoup
import re
from typing import List

def extract_text_from_html(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style", "noscript", "header", "footer", "nav", "form", "aside"]):
        tag.decompose()
    text = soup.get_text(separator="\n")
    text = re.sub(r"\n\s*\n+", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()

def chunk_text(text: str, max_chars: int = 1500, overlap: int = 200) -> List[str]:
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks = []
    current = ""
    for p in paragraphs:
        if not current:
            current = p
            continue
        if len(current) + len(p) + 2 <= max_chars:
            current = current + "\n\n" + p
        else:
            chunks.append(current)
            current = (current[-overlap:] + "\n\n" + p) if overlap < len(current) else p
    if current:
        chunks.append(current)
    return chunks