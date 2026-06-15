import { useState } from "react";

const EU_COUNTRIES = [
  { code: "de", label: "🇩🇪 Germany" },
  { code: "fr", label: "🇫🇷 France" },
  { code: "gb", label: "🇬🇧 United Kingdom" },
  { code: "nl", label: "🇳🇱 Netherlands" },
  { code: "es", label: "🇪🇸 Spain" },
  { code: "it", label: "🇮🇹 Italy" },
  { code: "at", label: "🇦🇹 Austria" },
  { code: "ch", label: "🇨🇭 Switzerland" },
  { code: "be", label: "🇧🇪 Belgium" },
  { code: "pl", label: "🇵🇱 Poland" },
  { code: "se", label: "🇸🇪 Sweden" },
];

const EXAMPLES = [
  "Python developer with 3 years in ML, experience with scikit-learn, pandas, SQL, and deploying models to AWS.",
  "Data analyst background, strong in Tableau, Power BI, SQL, Excel. Moving into machine learning with Python.",
  "MLOps engineer experienced with Kubernetes, Docker, MLflow, CI/CD pipelines, and cloud infrastructure on Azure.",
];

const css = `
  .input-screen { }

  .hero {
    margin-bottom: 2.5rem;
  }

  .hero-eyebrow {
    font-size: .75rem;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: .75rem;
  }

  .hero-title {
    font-family: var(--font-head);
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    font-weight: 700;
    line-height: 1.15;
    color: var(--ink);
    margin-bottom: 1rem;
    letter-spacing: -.02em;
  }

  .hero-title em {
    font-style: normal;
    color: var(--accent);
  }

  .hero-desc {
    font-size: .95rem;
    color: var(--ink-mid);
    max-width: 560px;
    line-height: 1.7;
  }

  .pipeline-strip {
    display: flex;
    align-items: center;
    gap: .5rem;
    flex-wrap: wrap;
    margin: 1.5rem 0 2.5rem;
  }

  .pipeline-chip {
    font-size: .72rem;
    font-weight: 500;
    letter-spacing: .03em;
    color: var(--ink-mid);
    background: var(--surface);
    border: 1px solid var(--surface-3);
    border-radius: 20px;
    padding: .25rem .75rem;
    white-space: nowrap;
  }

  .pipeline-arrow {
    color: var(--ink-faint);
    font-size: .8rem;
    flex-shrink: 0;
  }

  .form-card {
    background: var(--surface);
    border: 1px solid var(--surface-3);
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow);
  }

  .form-label {
    display: block;
    font-size: .82rem;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: .5rem;
    letter-spacing: .01em;
  }

  .form-textarea {
    width: 100%;
    min-height: 160px;
    padding: .85rem 1rem;
    font-family: var(--font-body);
    font-size: .9rem;
    line-height: 1.6;
    color: var(--ink);
    background: var(--surface-2);
    border: 1.5px solid var(--surface-3);
    border-radius: var(--radius);
    resize: vertical;
    transition: border-color var(--transition), box-shadow var(--transition);
    outline: none;
  }

  .form-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
    background: var(--surface);
  }

  .form-textarea::placeholder { color: var(--ink-faint); }

  .examples-row {
    display: flex;
    gap: .5rem;
    flex-wrap: wrap;
    margin-top: .6rem;
    margin-bottom: 1.5rem;
  }

  .example-chip {
    font-size: .75rem;
    color: var(--accent);
    background: var(--accent-glow);
    border: 1px solid rgba(26,86,219,.15);
    border-radius: 6px;
    padding: .25rem .6rem;
    cursor: pointer;
    transition: all var(--transition);
    line-height: 1.4;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .example-chip:hover {
    background: rgba(26,86,219,.2);
    border-color: var(--accent);
  }

  .form-row {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    margin-top: 1.25rem;
  }

  .form-select-wrap { flex: 1; }

  .form-select {
    width: 100%;
    padding: .7rem 1rem;
    font-family: var(--font-body);
    font-size: .88rem;
    color: var(--ink);
    background: var(--surface-2);
    border: 1.5px solid var(--surface-3);
    border-radius: var(--radius);
    outline: none;
    cursor: pointer;
    transition: border-color var(--transition);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236b7280' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right .85rem center;
  }

  .form-select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .btn-primary {
    flex-shrink: 0;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    padding: .75rem 1.75rem;
    font-family: var(--font-head);
    font-size: .9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition);
    letter-spacing: .01em;
    white-space: nowrap;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--accent-2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(26,86,219,.3);
  }

  .btn-primary:disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  .form-hint {
    margin-top: 1rem;
    font-size: .78rem;
    color: var(--ink-faint);
    display: flex;
    align-items: center;
    gap: .35rem;
  }
`;

export default function InputScreen({ onSubmit }) {
  const [text,    setText]    = useState("");
  const [country, setCountry] = useState("de");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit({ text: text.trim(), country });
  };

  return (
    <>
      <style>{css}</style>
      <div className="input-screen">
        <div className="hero">
          <p className="hero-eyebrow">European AI Career Intelligence System</p>
          <h1 className="hero-title">
            Find your AI career<br />
            <em>archetype</em> in Europe
          </h1>
          <p className="hero-desc">
            Paste your skills or resume summary. EACIS uses DistilBERT semantic search
            across 1,088 European AI job postings to match you to one of five
            data-driven archetypes and surface live openings.
          </p>
        </div>

        <div className="pipeline-strip">
          <span className="pipeline-chip">Skill Extraction</span>
          <span className="pipeline-arrow">→</span>
          <span className="pipeline-chip">Archetype Matching</span>
          <span className="pipeline-arrow">→</span>
          <span className="pipeline-chip">FAISS Semantic Search</span>
          <span className="pipeline-arrow">→</span>
          <span className="pipeline-chip">Live Jobs via Adzuna</span>
          <span className="pipeline-arrow">→</span>
          <span className="pipeline-chip">Career Report</span>
        </div>

        <div className="form-card">
          <label className="form-label">Your skills or resume summary</label>
          <textarea
            className="form-textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="e.g. Python developer with experience in PyTorch, transformer models, and NLP. Familiar with HuggingFace, Docker, and deploying models to GCP…"
          />

          <div className="examples-row">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                className="example-chip"
                title={ex}
                onClick={() => setText(ex)}
              >
                Example {i + 1}
              </button>
            ))}
          </div>

          <div className="form-row">
            <div className="form-select-wrap">
              <label className="form-label" style={{ marginBottom: ".4rem" }}>Target country</label>
              <select
                className="form-select"
                value={country}
                onChange={e => setCountry(e.target.value)}
              >
                {EU_COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!text.trim()}
            >
              Analyse Profile →
            </button>
          </div>

          <p className="form-hint">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 10.5h-1.5v-5h1.5v5zm0-6.5h-1.5V3.5h1.5V5z"/>
            </svg>
            Analysis runs a ReAct agent with 6 steps including DistilBERT embedding — first load may take ~30 seconds.
          </p>
        </div>
      </div>
    </>
  );
}
