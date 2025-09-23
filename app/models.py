from email.policy import default
from app import embeddings
from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional


class CrawlRequest(BaseModel):
    url: HttpUrl
    depth: int = Field(default=5, ge=0, le=5)
    use_sitemap: bool = Field(default=True)

class PageResult(BaseModel):
    url:str
    embedding_dim: Optional[int] = None

class CrawlResult(BaseModel):
    task_id : str
    pages: List[PageResult]

class TaskStatus(BaseModel):
    task_id: str
    status: str

