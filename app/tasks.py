from app.crawler import crawl_site
from app.extractor import extract_text_from_html, chunk_text
from app.embeddings import get_embedding_function
from app.storage import METADATA, add_embeddings
from app.main import TASKS
import requests


emb_fn = get_embedding_function()


def run_crawl_task(task_id:str, url: str, depth: int, use_sitemap:bool):
    TASKS[task_id]["status"] = "running"
    urls_to_crawl = crawl_site(url, depth=depth, use_sitemap=use_sitemap)

    for page_url in urls_to_crawl:
        try:
            html = requests.get(page_url, timeout=5).text
            text = extract_text_from_html(html)
            chunks = chunk_text(text)
            embeddings = [emb_fn.embed_documents([c])[0] for c in chunks]
            metadata = [{"url": page_url, "chunk":c} for c in chunks]
            add_embeddings(embeddings, metadata)
            
            TASKS[task_id]["pages"].append({
                "url":page_url,
                "embedding_dim": len(embeddings[0])
            })
        except Exception:
            continue
    TASKS[task_id]["status"] = "completed"


