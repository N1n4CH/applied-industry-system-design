"""
EACIS Backend — European AI Career Intelligence System
FastAPI server wrapping the EACIS pipeline from system_design.ipynb

Deploy on Render:
  Build command:  pip install -r requirements.txt
  Start command:  uvicorn main:app --host 0.0.0.0 --port $PORT
"""

import os
import re
import logging
import json
import numpy as np
import pandas as pd
import torch
import faiss
import requests as http_requests

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer
from transformers import DistilBertTokenizer, DistilBertModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("eacis")

# ── Configuration ─────────────────────────────────────────────────────────────
CONFIG = {
    "app_id":          os.getenv("ADZUNA_APP_ID",  "c5693b3d"),
    "app_key":         os.getenv("ADZUNA_APP_KEY", "03dca8fc57644a271892eadb60b6c704"),
    "fit_strong":      0.4,
    "fit_partial":     0.2,
    "max_live_jobs":   5,
    "default_country": "de",
    "data_path":       os.getenv("DATA_PATH", "adzuna_ai_jobs_europe_enriched.csv"),
}

# ── Archetypes ─────────────────────────────────────────────────────────────────
ARCHETYPES = {
    0: "Data & Analytics Generalist",
    1: "Cloud ML Engineer",
    2: "MLOps & GenAI Engineer",
    3: "AI Automation & Integration",
    4: "Deep Learning & AI Research",
}

ARCHETYPE_SKILLS = {
    0: ["python", "sql", "machine learning", "agile", "git", "statistics", "tableau", "power bi"],
    1: ["python", "aws", "azure", "gcp", "kubernetes", "docker", "mlflow", "terraform"],
    2: ["python", "langchain", "llm", "rag", "mlops", "hugging face", "fastapi", "vector database"],
    3: ["python", "api integration", "automation", "n8n", "zapier", "rpa", "crm", "erp"],
    4: ["python", "pytorch", "tensorflow", "deep learning", "transformers", "cuda", "research", "arxiv"],
}

ARCHETYPE_ROLES = {
    0: ["Data Analyst", "BI Developer", "Analytics Engineer", "Data Scientist"],
    1: ["ML Engineer", "Cloud AI Engineer", "Platform Engineer", "MLOps Engineer"],
    2: ["GenAI Engineer", "LLM Engineer", "AI Product Engineer", "RAG Engineer"],
    3: ["AI Integration Specialist", "Automation Engineer", "RPA Developer", "AI Solutions Engineer"],
    4: ["Research Scientist", "Deep Learning Engineer", "Computer Vision Engineer", "NLP Researcher"],
}

ARCHETYPE_DESCRIPTIONS = {
    0: "You are a generalist who bridges data and business. You turn raw data into insights using SQL, Python, and visualisation tools. Roles in this cluster sit close to business stakeholders.",
    1: "You operate where ML meets cloud infrastructure. You build scalable ML pipelines on AWS, Azure, or GCP and manage model lifecycles with tools like MLflow and Kubernetes.",
    2: "You are at the frontier of generative AI. You build RAG pipelines, fine-tune LLMs, and deploy GenAI products. Demand for this profile is growing fastest in the European market.",
    3: "You connect AI capabilities to existing business systems. You automate workflows, integrate APIs, and deploy AI into CRM, ERP, and enterprise platforms.",
    4: "You work closest to the research frontier — training large models, advancing state-of-the-art architectures, and publishing or applying cutting-edge methods.",
}

# ── Global model state ─────────────────────────────────────────────────────────
state = {}


def build_index():
    """Load CSV, embed job descriptions with DistilBERT, build FAISS index."""
    logger.info("Loading dataset…")
    data_path = CONFIG["data_path"]
    if not os.path.exists(data_path):
        raise FileNotFoundError(
            f"Dataset not found at '{data_path}'. "
            "Copy adzuna_ai_jobs_europe_enriched.csv into the backend/ directory."
        )

    df = pd.read_csv(data_path)
    df = df.dropna(subset=["description"]).reset_index(drop=True)
    texts = (df["title"].fillna("") + " " + df["description"].fillna("")).tolist()

    logger.info("Loading DistilBERT…")
    tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
    model = DistilBertModel.from_pretrained("distilbert-base-uncased")
    model.eval()

    logger.info("Embedding %d job descriptions…", len(texts))
    embeddings = []
    batch_size = 32
    with torch.no_grad():
        for i in range(0, len(texts), batch_size):
            batch = texts[i: i + batch_size]
            enc = tokenizer(batch, padding=True, truncation=True, max_length=128, return_tensors="pt")
            out = model(**enc)
            vecs = out.last_hidden_state[:, 0, :].numpy()
            embeddings.append(vecs)

    embeddings = np.vstack(embeddings).astype("float32")
    faiss.normalize_L2(embeddings)

    index = faiss.IndexFlatIP(embeddings.shape[1])
    index.add(embeddings)

    logger.info("FAISS index built with %d vectors.", index.ntotal)
    return tokenizer, model, index, df, embeddings


def embed_query(text: str, tokenizer, model) -> np.ndarray:
    with torch.no_grad():
        enc = tokenizer(text, return_tensors="pt", truncation=True, max_length=128, padding=True)
        out = model(**enc)
        vec = out.last_hidden_state[:, 0, :].numpy().astype("float32")
    faiss.normalize_L2(vec)
    return vec


def skill_fit(user_skills: list[str], archetype_id: int) -> tuple[float, list[str], list[str]]:
    required = ARCHETYPE_SKILLS[archetype_id]
    matched = [s for s in required if any(s in u.lower() for u in user_skills)]
    missing = [s for s in required if s not in matched]
    score = len(matched) / len(required)
    return score, matched, missing


def classify_fit(score: float) -> str:
    if score >= CONFIG["fit_strong"]:
        return "Strong Fit"
    if score >= CONFIG["fit_partial"]:
        return "Partial Fit"
    return "Low Fit"


def fetch_live_jobs(query: str, country: str = None) -> list[dict]:
    country = country or CONFIG["default_country"]
    try:
        url = (
            f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
            f"?app_id={CONFIG['app_id']}&app_key={CONFIG['app_key']}"
            f"&results_per_page={CONFIG['max_live_jobs']}"
            f"&what={query.replace(' ', '%20')}&content-type=application/json"
        )
        resp = http_requests.get(url, timeout=10)
        if resp.status_code == 200:
            results = resp.json().get("results", [])
            return [
                {
                    "title": j.get("title", ""),
                    "company": j.get("company", {}).get("display_name", ""),
                    "location": j.get("location", {}).get("display_name", ""),
                    "salary_min": j.get("salary_min"),
                    "salary_max": j.get("salary_max"),
                    "url": j.get("redirect_url", ""),
                }
                for j in results
            ]
    except Exception as e:
        logger.warning("Live job fetch failed: %s", e)
    return []


def parse_skills(text: str) -> list[str]:
    """Simple keyword extraction from free text."""
    known = [
        "python", "sql", "java", "javascript", "typescript", "r", "scala", "go",
        "aws", "azure", "gcp", "kubernetes", "docker", "terraform", "mlflow",
        "pytorch", "tensorflow", "keras", "scikit-learn", "hugging face",
        "langchain", "llm", "rag", "transformers", "bert", "gpt",
        "spark", "hadoop", "airflow", "dbt", "snowflake", "databricks",
        "fastapi", "django", "flask", "react", "node",
        "machine learning", "deep learning", "nlp", "computer vision",
        "statistics", "tableau", "power bi", "looker",
        "agile", "git", "ci/cd", "mlops", "devops",
        "automation", "api integration", "n8n", "zapier", "rpa",
        "research", "arxiv", "cuda", "vector database",
    ]
    text_lower = text.lower()
    return [k for k in known if k in text_lower]


def run_agent(user_input: str, country: str) -> dict:
    """ReAct-style agent: classify → retrieve → recommend → fetch jobs."""
    trace = []

    # Step 1: Extract skills
    trace.append({"step": "Extracting skills from your profile…", "detail": ""})
    user_skills = parse_skills(user_input)
    trace[-1]["detail"] = f"Found {len(user_skills)} skill signals: {', '.join(user_skills[:10]) or 'none detected'}"

    # Step 2: Score archetypes
    trace.append({"step": "Matching against 5 European AI archetypes…", "detail": ""})
    scores = {}
    for aid in ARCHETYPES:
        score, matched, missing = skill_fit(user_skills, aid)
        scores[aid] = {"score": score, "matched": matched, "missing": missing, "fit": classify_fit(score)}

    best_id = max(scores, key=lambda x: scores[x]["score"])
    trace[-1]["detail"] = (
        f"Best match: {ARCHETYPES[best_id]} "
        f"({scores[best_id]['fit']}, {int(scores[best_id]['score']*100)}% skill overlap)"
    )

    # Step 3: Semantic retrieval via FAISS
    trace.append({"step": "Running semantic search across 1,088 European job postings…", "detail": ""})
    vec = embed_query(user_input, state["tokenizer"], state["model"])
    D, I = state["index"].search(vec, 5)
    similar_jobs = []
    for idx in I[0]:
        row = state["df"].iloc[idx]
        similar_jobs.append({
            "title": str(row.get("title", "")),
            "company": str(row.get("company", "")),
            "location": str(row.get("location", "")),
            "salary_min": float(row["salary_min"]) if "salary_min" in row and pd.notna(row.get("salary_min")) else None,
            "salary_max": float(row["salary_max"]) if "salary_max" in row and pd.notna(row.get("salary_max")) else None,
        })
    trace[-1]["detail"] = f"Retrieved {len(similar_jobs)} semantically similar postings from the index."

    # Step 4: Salary estimate
    trace.append({"step": "Calculating salary range from matched postings…", "detail": ""})
    sal_rows = state["df"].iloc[I[0]]
    salaries = []
    for col in ["salary_min", "salary_max"]:
        if col in sal_rows.columns:
            vals = pd.to_numeric(sal_rows[col], errors="coerce").dropna()
            salaries.extend(vals.tolist())
    salary_range = None
    if salaries:
        salary_range = {"min": int(np.percentile(salaries, 25)), "max": int(np.percentile(salaries, 75))}
        trace[-1]["detail"] = f"Estimated range: €{salary_range['min']:,} – €{salary_range['max']:,} / year"
    else:
        trace[-1]["detail"] = "Insufficient salary data in matched postings."

    # Step 5: Live jobs
    trace.append({"step": f"Fetching live openings from Adzuna ({country.upper()})…", "detail": ""})
    query_role = ARCHETYPE_ROLES[best_id][0]
    live_jobs = fetch_live_jobs(query_role, country)
    trace[-1]["detail"] = f"Found {len(live_jobs)} live openings for '{query_role}' in {country.upper()}."

    # Step 6: Generate recommendation text
    trace.append({"step": "Assembling your career report…", "detail": ""})

    archetype_scores = [
        {
            "id": aid,
            "name": ARCHETYPES[aid],
            "score": scores[aid]["score"],
            "fit": scores[aid]["fit"],
            "matched": scores[aid]["matched"],
            "missing": scores[aid]["missing"][:4],
        }
        for aid in sorted(scores, key=lambda x: scores[x]["score"], reverse=True)
    ]

    trace[-1]["detail"] = "Report ready."

    return {
        "archetype_id": best_id,
        "archetype_name": ARCHETYPES[best_id],
        "archetype_description": ARCHETYPE_DESCRIPTIONS[best_id],
        "fit_label": scores[best_id]["fit"],
        "fit_score": round(scores[best_id]["score"], 2),
        "matched_skills": scores[best_id]["matched"],
        "missing_skills": scores[best_id]["missing"][:5],
        "target_roles": ARCHETYPE_ROLES[best_id],
        "archetype_scores": archetype_scores,
        "similar_jobs": similar_jobs,
        "salary_range": salary_range,
        "live_jobs": live_jobs,
        "reasoning_trace": trace,
        "user_skills": user_skills,
    }


# ── Lifespan (build index at startup) ────────────────────────────────────────
import asyncio

async def build_index_async():
    try:
        tokenizer, model, index, df, embeddings = await asyncio.to_thread(build_index)
        state["tokenizer"] = tokenizer
        state["model"] = model
        state["index"] = index
        state["df"] = df
        state["embeddings"] = embeddings
        logger.info("Index ready. EACIS is live.")
    except Exception as e:
        logger.error("Failed to build index: %s", e)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("EACIS startup — launching background indexing…")
    asyncio.create_task(build_index_async())
    yield
    state.clear()


# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(title="EACIS API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your Vercel URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyseRequest(BaseModel):
    text: str
    country: str = "de"


@app.get("/health")
def health():
    return {"status": "ok", "index_ready": "index" in state}


@app.post("/analyse")
def analyse(req: AnalyseRequest):
    if "index" not in state:
        raise HTTPException(503, "Index not ready yet — please try again in a moment.")
    if not req.text.strip():
        raise HTTPException(400, "Please provide some profile text.")
    try:
        result = run_agent(req.text, req.country)
        return result
    except Exception as e:
        logger.exception("Agent error")
        raise HTTPException(500, str(e))
