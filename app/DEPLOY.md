# EACIS Deployment Guide

## Repo structure

```
applied-industry-system-design/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── components/
│           ├── InputScreen.jsx
│           ├── LoadingScreen.jsx
│           └── ReportScreen.jsx
└── system_design.ipynb   ← original notebook
```

---

## Step 1 — Copy the dataset into backend/

The backend needs the enriched CSV at startup:

```bash
cp adzuna_ai_jobs_europe_enriched.csv backend/
```

Then commit and push:

```bash
git add backend/ frontend/
git commit -m "Add full-stack EACIS app"
git push
```

---

## Step 2 — Deploy backend on Render

1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo
3. Set **Root Directory** → `backend`
4. **Build command:** `pip install -r requirements.txt`
5. **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Instance type:** Free
7. Deploy → copy your service URL (e.g. `https://eacis-backend.onrender.com`)

> ⚠️ First deploy takes ~15 minutes — Render builds the DistilBERT index on startup.
> Free tier spins down after 15 min of inactivity; next cold start rebuilds the index.

### Optional env vars on Render

| Key            | Value                        |
|----------------|------------------------------|
| ADZUNA_APP_ID  | your Adzuna app ID           |
| ADZUNA_APP_KEY | your Adzuna API key          |
| DATA_PATH      | adzuna_ai_jobs_europe_enriched.csv |

---

## Step 3 — Deploy frontend on Vercel

1. Go to https://vercel.com → New Project → Import your GitHub repo
2. Set **Root Directory** → `frontend`
3. **Framework preset:** Vite
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://eacis-backend.onrender.com`)
5. Deploy

---

## Local development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cp ../adzuna_ai_jobs_europe_enriched.csv .
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local: VITE_API_URL=http://localhost:8000
npm run dev
```

Open http://localhost:5173

---

## API endpoints

| Method | Path       | Description                    |
|--------|------------|--------------------------------|
| GET    | /health    | Check if index is ready        |
| POST   | /analyse   | Run the EACIS agent            |

**POST /analyse body:**
```json
{
  "text": "Python developer with PyTorch and NLP experience...",
  "country": "de"
}
```
