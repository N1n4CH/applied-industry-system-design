# European AI Career Intelligence System (EACIS)
## Industry-Integrated AI Systems Synthesis

EACIS is a multi-layer AI platform that integrates all six prior
projects into a single end-to-end career guidance system for the European
AI job market. Given a resume or skill description, the system matches the
candidate against five data-driven AI job market archetypes, retrieves
semantically similar job postings via RAG, generates a personalised
recommendation, fetches current live openings and assembles a
salary-informed career report - all orchestrated by a ReAct agent.

The project is positioned as a European-focused, transparency-first,
candidate-facing alternative to US platforms such as Jobright.ai,
designed with EU AI Act compliance built into the architecture from
the outset.

---

## How to Run the Project

**1. Clone the repository**

    git clone https://github.com/n1n4ch/applied-insdustry-system-design.git
    cd applied-industry-system-design

**2. Install dependencies**

    pip install -r requirements.txt

**3. Copy required file from Project 4**

    cp ../deep-learning-systems/adzuna_ai_jobs_europe_enriched.csv ./

> It contains 1,088 enriched European AI job postings used to build the FAISS index.
> An internet connection is required on first run to download DistilBERT
> weights from HuggingFace (~250MB). Building the FAISS index takes
> approximately 10–20 minutes on CPU.

**4. Open and run the notebook**

    jupyter notebook system_design.ipynb

Run all cells in order via **Kernel → Restart & Run All**

---

## Project Structure

| File | Description |
|------|-------------|
| `system_design.ipynb` | Main notebook - Tasks 1–6, full EACIS demonstration |
| `adzuna_ai_jobs_europe_enriched.csv` | Job postings for FAISS index - copy from Project 4 |
| `Reflective_Synthesis_Paper_v2.pdf` | 1,650-word capstone synthesis paper with citations |
| `requirements.txt` | Python dependencies (generated via `pip freeze`) |

---

## System Architecture

EACIS integrates six project layers in a strict dependency chain:

| Layer | Project | Contribution |
|-------|---------|-------------|
| Data infrastructure | Project 1 | Adzuna API pipeline, description enrichment |
| Market intelligence | Project 2 | EUR salary statistics, ANOVA-informed ranges |
| Skill taxonomy & archetypes | Project 3 | 50-skill taxonomy, k-means role clustering |
| Semantic representation | Project 4 | DistilBERT embeddings, FAISS vector index |
| Recommendation logic | Project 5 | 3-tier fit routing, structured templates |
| Agentic orchestration | Project 6 | ReAct agent, state management, reasoning trace |

**Offline pipeline** - runs once to build system artefacts:
data collection → skill extraction → k-means clustering →
DistilBERT encoding → FAISS index → salary pre-computation

**Online pipeline** — runs per candidate query:
extract_skills → match_archetype → rag_retrieve →
generate_recommendation → fetch_live_jobs → get_salary_range →
assemble_report

---

## Key Findings

Four candidate profiles were run through the full pipeline:

| Profile | Skills | Archetype | Fit | Score |
|---------|--------|-----------|-----|-------|
| Senior ML Engineer | 9 | Deep Learning & AI Research | STRONG | 0.59 |
| Finance Analyst | 3 | Data & Analytics Generalist | STRONG | 0.61 |
| Automotive Engineer | 2 | Deep Learning & AI Research | STRONG | 0.50 |
| Career Switcher | 1 | Data & Analytics Generalist | PARTIAL | 0.35 |

The most significant result is the automotive engineer - Python and
computer vision skills alone produce a strong match to Deep Learning
& AI Research, with directly relevant live job postings returned.
This validates the core hypothesis of the system: skill-based matching
surfaces relevant career pathways regardless of a candidate's industry
of origin.

All seven integration layers were exercised across all four profiles,
confirming EACIS functions as a genuinely integrated system.

---

## Integration Across Prior Projects

| Design Decision | Evidence Base |
|----------------|--------------|
| DistilBERT over TF-IDF | Higher silhouette score in P4 experimental comparison |
| Templates over GPT-2 | Hallucinations observed in P5 testing |
| Single-agent over multi-agent | Simpler state management, fully traceable reasoning (P6) |
| DistilBERT over mBERT | 85%+ postings in English, CPU constraints |
| DACH salary ranges | ANOVA result F=4.56 p=0.0107 from P2 |

---

## Ethical and Responsible Use

EACIS is designed exclusively as a candidate-facing career orientation
tool. It must not be used for recruiter-facing screening or applicant
ranking. Three specific ethical risks are documented:

- **Recruiter misuse** — similarity scores could be used to filter
  applicants, encoding UK/DACH hiring biases into decisions
- **Confident outputs without uncertainty** — recommendations are based
  on a 50-skill keyword taxonomy; all five archetype scores are available
  for candidates who want fuller context
- **Geographic data bias** — 80%+ of postings from UK and Germany;
  salary ranges are labelled DACH-specific, not pan-European

Under the EU AI Act, any deployment in a recruitment context requires
classification as a high-risk AI system under Annex III, with core
compliance requirements enforceable from August 2026.

---

## Requirements

Regenerate with:

    pip freeze > requirements.txt
