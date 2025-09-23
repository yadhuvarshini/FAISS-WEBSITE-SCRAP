import faiss
import numpy as np
from typing import List, Tuple


EMBEDDING_DIM = 384
index = faiss.IndexFlatL2(EMBEDDING_DIM)

METADATA = {}

def add_embeddings(vectors: List[List[float]], metadata: List[dict]):
    
    vectors_np = np.array(vectors).astype("float32")
    start_id = index.ntotal
    index.add(vectors_np)
    for i, meta in enumerate(metadata):
        METADATA[start_id + i] = meta

def search_embedding(query_vector: List[float], top_k: int = 5) -> List[Tuple[dict, float]]:
    
    xq = np.array([query_vector]).astype("float32")
    distances, indices = index.search(xq, top_k)
    results = []
    for idx, dist in zip(indices[0], distances[0]):
        if idx in METADATA:
            results.append((METADATA[idx], float(dist)))
    return results