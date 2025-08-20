# app.py  — safe and robust MineGuard search API

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import faiss
import pickle
import numpy as np
from pathlib import Path
import logging

# ----- CONFIG -----
BASE = Path(__file__).resolve().parent
MODEL_NAME_FILE = BASE / "model_name.txt"
INDEX_FILE = BASE / "mining_laws.index"
CHUNKS_FILE = BASE / "chunks.pkl"

# optional: set True to print debug messages to terminal
DEBUG = True
if DEBUG:
    logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("mineguard")

# ----- helpers -----
def extract_text(item):
    """
    Return a plain string extracted from item.
    Handles: str, dict (common keys), list/tuple/numpy arrays (pick first text-like element).
    Falls back to str(item).
    """
    # direct string
    if isinstance(item, str):
        return item

    # dict: try common keys first, then any string value
    if isinstance(item, dict):
        for k in ("text", "content", "chunk", "section", "body", "summary"):
            v = item.get(k)
            if isinstance(v, str):
                return v
        # try any string value in dict
        for v in item.values():
            if isinstance(v, str):
                return v
            # if value is list, try its elements
            if isinstance(v, (list, tuple, np.ndarray)):
                for elem in v:
                    if isinstance(elem, str):
                        return elem
                    if isinstance(elem, dict):
                        # recursive
                        text = extract_text(elem)
                        if text:
                            return text
        # fallback to first key->value string if possible
        try:
            for v in item.values():
                return str(v)
        except Exception:
            pass
        return str(item)

    # list/tuple/numpy array: pick first element that yields text
    if isinstance(item, (list, tuple, np.ndarray)):
        for elem in item:
            txt = extract_text(elem)
            if txt:
                return txt
        return str(item)

    # fallback
    return str(item)


# ----- load model/index/chunks with clear errors -----
emb_model = None
index = None
chunks = None

try:
    if not MODEL_NAME_FILE.exists():
        raise FileNotFoundError(f"{MODEL_NAME_FILE.name} not found in {BASE}")
    model_name = MODEL_NAME_FILE.read_text(encoding="utf-8").strip()
    logger.debug(f"Loading SentenceTransformer model: {model_name}")
    emb_model = SentenceTransformer(model_name)

    if not INDEX_FILE.exists():
        raise FileNotFoundError(f"{INDEX_FILE.name} not found in {BASE}")
    logger.debug(f"Loading FAISS index: {INDEX_FILE}")
    index = faiss.read_index(str(INDEX_FILE))

    if not CHUNKS_FILE.exists():
        raise FileNotFoundError(f"{CHUNKS_FILE.name} not found in {BASE}")
    logger.debug(f"Loading chunks pickle: {CHUNKS_FILE}")
    with open(CHUNKS_FILE, "rb") as f:
        chunks = pickle.load(f)

    logger.debug("Model, index and chunks loaded successfully.")

except Exception as e:
    # keep server up but mark as not initialized
    logger.exception("Error during startup loading model/index/chunks:")
    emb_model = None
    index = None
    chunks = None
    startup_error = str(e)


# ----- FastAPI app -----
app = FastAPI(title="MineGuard API", version="0.1")

class QueryRequest(BaseModel):
    query: str

@app.get("/")
def root():
    return {"message": "MineGuard API running", "status": "ok" if emb_model and index and chunks else "degraded"}

@app.get("/health")
def health():
    """
    Quick status endpoint to check model/index dims and chunk count.
    """
    if not (emb_model and index and chunks):
        return {"ok": False, "error": locals().get("startup_error", "not initialized")}
    # try to infer dims
    try:
        # get a sample embedding to infer dim
        sample = emb_model.encode(["_sanity_check_"], convert_to_numpy=True)
        model_dim = sample.shape[-1]
    except Exception:
        model_dim = None
    try:
        index_dim = index.d
    except Exception:   
        index_dim = None
    try:
        n_chunks = len(chunks)
    except Exception:
        n_chunks = None
    return {"ok": True, "model_dim": model_dim, "index_dim": index_dim, "n_chunks": n_chunks}

@app.post("/search")
def search_laws(request: QueryRequest, top_k: int = 3, normalize: bool = False):
    """
    Search for relevant law sections.
    - request.query: user query string
    - top_k: number of results (default 3)
    - normalize: set True if index built with normalized vectors (cosine via IndexFlatIP)
    """
    if not (emb_model and index and chunks):
        raise HTTPException(status_code=500, detail=f"Server not initialized: {locals().get('startup_error','missing assets')}")

    try:
        # 1. create embedding (ensure float32 and shape (1,dim))
        q = emb_model.encode([request.query], convert_to_numpy=True)
        if not isinstance(q, np.ndarray):
            q = np.array(q)
        if q.dtype != np.float32:
            q = q.astype(np.float32)
        if q.ndim == 1:
            q = q.reshape(1, -1)

        # optional normalization for cosine similarity
        if normalize:
            faiss.normalize_L2(q)

        # 2. search
        distances, indices = index.search(q, top_k)

        results = []
        # indices is shape (1, top_k)
        for idx_val, dist in zip(indices[0], distances[0]):
            # FAISS returns -1 for missing neighbors
            try:
                idx_int = int(idx_val)
            except Exception:
                logger.debug(f"Could not convert idx_val to int: {idx_val}")
                continue
            if idx_int < 0:
                continue

            # Safely access chunks depending on its data structure
            item = None
            try:
                # if chunks is list-like
                if isinstance(chunks, (list, tuple, np.ndarray)):
                    if 0 <= idx_int < len(chunks):
                        item = chunks[idx_int]
                elif isinstance(chunks, dict):
                    # try int key, then string key
                    if idx_int in chunks:
                        item = chunks[idx_int]
                    elif str(idx_int) in chunks:
                        item = chunks[str(idx_int)]
                    else:
                        # if dict maps law names to lists, pick something reasonable:
                        # pick the first element if idx_int is not a key
                        # but safer to skip
                        logger.debug(f"Dict chunks has no key {idx_int} or '{str(idx_int)}'")
                        item = None
                else:
                    # fallback: attempt to index
                    try:
                        item = chunks[idx_int]
                    except Exception:
                        item = None
            except Exception as e:
                logger.exception("Error accessing chunks by index:")
                item = None

            text = extract_text(item) if item is not None else "(no snippet available)"
            snippet = (text[:500] + "...") if isinstance(text, str) else str(text)

            results.append({
                "score": float(dist),
                "index": idx_int,
                "section": snippet
            })

        return {"results": results}

    except Exception as e:
        logger.exception("Search failed:")
        # return readable error in JSON
        raise HTTPException(status_code=500, detail=str(e))
