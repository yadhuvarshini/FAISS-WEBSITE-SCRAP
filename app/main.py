import logging
from fastapi import FastAPI, HTTPException, BackgroundTasks
from app.models import CrawlRequest, CrawlResult, PageResult, TaskStatus
from app.crawler import crawl_site
from app.extractor import extract_text_from_html, chunk_text
from app.embeddings import get_embedding_function
from typing import Dict
import uuid
import requests 

from app.utils import session,retries

TASKS: Dict[str, Dict] = {}
app = FastAPI(title="Web Crawler")

emb_fn = get_embedding_function()

logging.basicConfig(level=logging.INFO)

@app.get('/status/{task_id}', response_model=TaskStatus)
async def get_status(task_id: str):
    task = TASKS.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="task not found or not available")
    return TaskStatus(task_id=task_id, status=task["status"])

@app.post('/crawl', response_model=TaskStatus)
async def start_crawling(req: CrawlRequest, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    TASKS[task_id] = {'status': 'started', "pages": []}
    background_tasks.add_task(crawl_task, task_id, req)
    return TaskStatus(task_id=task_id, status="started")

@app.get('/result/{task_id}', response_model=CrawlResult)
async def get_result(task_id: str):
    task = TASKS.get(task_id)
    if not task or "pages" not in task:
        raise HTTPException(status_code=404, detail="No valid result found for this id")
    pages_data = task.get("pages", [])
    pages = [PageResult(url=p["url"], embedding_dim=p.get("embedding_dim")) for p in pages_data]
    return CrawlResult(task_id=task_id, pages=pages)

def crawl_task(task_id: str, req: CrawlRequest) -> None:
    try:
        urls = crawl_site(url=str(req.url), depth=req.depth, use_sitemap=req.use_sitemap)
        if not urls:
            TASKS[task_id]["status"]="Failed"
            return

        for u in urls:
            try:
                resp = session.get(u, timeout=8, verify=False)
                html = resp.text
                text = extract_text_from_html(html)
                chunks = chunk_text(text)

                # Generate embeddings if chunks exist
                if chunks:
                    embeddings = [emb_fn.embed_documents([c])[0] for c in chunks]
                    embedding_dim = len(embeddings[0])
                else:
                    embedding_dim = None

                # TASKS[task_id]["pages"].append({
                #     "url": u,
                #     "embedding_dim": embedding_dim
                # })
                logging.info(f"Crawled: {u}, embeddings: {embedding_dim}")
            except Exception as e:
                logging.error(f"Failed to process {u}: {e}")

            TASKS[task_id]["pages"].append({
            "url": u,
            "embedding_dim": embedding_dim
        })
        print("result:",len(TASKS[task_id]["pages"]))

    except Exception as exc:
        logging.exception("crawl_task failed for task_id=%s: %s", task_id, exc)
    
    finally:
        
        TASKS[task_id]["status"] = "completed"
        logging.info(f"Task {task_id} completed with {len(TASKS[task_id]['pages'])} pages")
    
    
