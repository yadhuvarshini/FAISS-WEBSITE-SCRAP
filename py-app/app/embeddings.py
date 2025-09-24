# app/embeddings.py
import os
import certifi
import logging
from functools import lru_cache

from langchain_huggingface import HuggingFaceEmbeddings

os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def get_embedding_function():
   
    try:
        logging.info(f"Loading embedding model: {MODEL_NAME}")
        return HuggingFaceEmbeddings(
            model_name=MODEL_NAME,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
            cache_folder="./models"  # local cache
        )
    except Exception as e:
        logging.error(f"❌ Failed to load embedding model: {e}")
        return None