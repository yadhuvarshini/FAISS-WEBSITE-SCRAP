# Python Web Scraping + FastAPI App

This project is a Python web scraping and text processing service built with FastAPI.
It includes:
	•	🌐 Crawler → Sitemap + spider crawling
	•	🧹 Extractor → HTML parsing & text cleaning
	•	🔎 Embeddings → Generate embeddings for scraped text
	•	📦 Storage → Save embeddings into VectorDB/FAISS
	•	⚡ Tasks → Async background workers for long-running jobs

## Project Structure
```
py-app/
│── app/
│   ├── main.py          # FastAPI entry point
│   ├── models.py        # Pydantic request/response models
│   ├── crawler.py       # Sitemap & spider crawling logic
│   ├── extractor.py     # HTML parsing & text cleaning
│   ├── embeddings.py    # LLM embedding functions
│   ├── storage.py       # Vector DB or FAISS storage
│   └── tasks.py         # Async background tasks
│
│── requirements.txt     # Python dependencies
│── README.md            # Project documentation
```

## Getting Started

#### 1. Clone the Repo
```
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>/app/py-app
```

#### 2. Create Virtual Environment
```
python3 -m venv .venv
source .venv/bin/activate   # Mac/Linux
.venv\Scripts\activate      # Windows
```

#### 3. Install Dependencies
```
pip install -r requirements.txt
```

#### 4. Run the FastAPI Server
```
uvicorn app.main:app --reload
```

#### Server will start at:
👉 http://127.0.0.1:8000

#### Interactive API docs:
👉 http://127.0.0.1:8000/docs

## Example Endpoints
	•	POST /crawl → Start crawling a sitemap or domain
	•	GET /extract/{url} → Extract and clean HTML from a given URL
	•	POST /embed → Generate embeddings from text
	•	GET /search?query=... → Search stored embeddings in vector DB

## Dependencies
	•	FastAPI – web framework
	•	Uvicorn – ASGI server
	•	BeautifulSoup4 / lxml – HTML parsing
	•	Requests / httpx – HTTP requests
	•	FAISS / Chroma / Pinecone – Vector DB storage (choose one)
	•	Pydantic – request/response validation

## Development Notes
	•	Keep all scraping logic inside crawler.py & extractor.py.
	•	Embeddings and vector storage are modular → swap FAISS with any other DB.
	•	Async background tasks (tasks.py) can be run with Celery or RQ if scaling is needed.

## Future Improvements
	•	Add Dockerfile for containerized deployment
	•	Add scheduler for recurring scraping jobs
	•	Add authentication for API endpoints
