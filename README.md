# Monorepo: TypeScript API + Python App

#### This repository is a monorepo containing two independent projects:

1.ts-api → TypeScript + Express + Prisma REST API

2.py-app → Python + FastAPI application with crawling, embeddings, and storage


## Folder Structure
```
app/

│── ts-api/ # TypeScript + Prisma + Express API

│ ├── src/ # Source code

│ ├── prisma/ # Prisma schema & migrations

│ ├── dist/ # Build output

│ ├── package.json

│ └── tsconfig.json

│

│── py-app/ # Python FastAPI application

│ ├── app/

│ │ ├── main.py # FastAPI entry point

│ │ ├── models.py # Pydantic models

│ │ ├── crawler.py # Sitemap & spider crawling

│ │ ├── embeddings.py # LLM embeddings

│ │ ├── storage.py # VectorDB / FAISS

│ │ └── tasks.py # Async background tasks

│ ├── requirements.txt

│ └── ...

│

│── .gitignore

│── README.md
```


## Cloning the Repo

#### Clone the full monorepo:
```
git clone https://github.com//.git

cd
```


## Running Projects

#### 1\. Run TypeScript API
```
cd app/ts-api

npm install

npm run dev
```
•Runs Express + Prisma API server.

•Configs live in src/ and prisma/.



#### 2\. Run Python App
```
cd app/py-app

python3 -m venv .venv

source .venv/bin/activate # (Linux/Mac)

.venv\\Scripts\\activate # (Windows)

pip install -r requirements.txt

uvicorn app.main:app --reload
```

•Runs FastAPI server at http://127.0.0.1:8000.

•Uses embeddings + vector storage logic in app/.


#### Development Notes

•Each project is independent → install dependencies inside its own folder.

•No nested Git repos → .git only exists at the monorepo root.

•.gitignore is managed globally, but project-specific ignores are nested inside.


#### Future Improvements

•Add Docker + Docker Compose for unified dev environment

•Add CI/CD pipelines for both projects

•Add shared utilities folder (if needed later)

