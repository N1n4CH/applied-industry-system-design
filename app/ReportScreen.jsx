const css = `
  .report-screen { }

  /* ── Back button ── */
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    font-size: .83rem;
    color: var(--ink-faint);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-bottom: 2rem;
    transition: color var(--transition);
    font-family: var(--font-body);
  }
  .back-btn:hover { color: var(--accent); }

  /* ── Section label ── */
  .section-eyebrow {
    font-size: .7rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: .5rem;
  }

  /* ── Archetype hero ── */
  .archetype-hero {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
    border-radius: var(--radius-lg);
    padding: 2rem;
    color: #fff;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .archetype-hero::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,.06);
  }

  .archetype-hero-eyebrow {
    font-size: .72rem;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
    opacity: .7;
    margin-bottom: .6rem;
  }

  .archetype-name {
    font-family: var(--font-head);
    font-size: 1.7rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: .75rem;
    letter-spacing: -.01em;
  }

  .archetype-desc {
    font-size: .88rem;
    line-height: 1.65;
    opacity: .88;
    max-width: 540px;
  }

  .fit-badge {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    margin-top: 1.25rem;
    background: rgba(255,255,255,.15);
    border: 1px solid rgba(255,255,255,.2);
    border-radius: 20px;
    padding: .3rem .9rem;
    font-size: .8rem;
    font-weight: 600;
  }

  /* ── Cards ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--surface-3);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    margin-bottom: 1.25rem;
    box-shadow: var(--shadow);
  }

  .card-title {
    font-family: var(--font-head);
    font-size: 1rem;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 1rem;
  }

  /* ── Archetype bar chart ── */
  .archetype-bars { display: flex; flex-direction: column; gap: .6rem; }

  .arch-bar-row {
    display: grid;
    grid-template-columns: 1fr 3fr auto;
    align-items: center;
    gap: .75rem;
  }

  .arch-bar-label {
    font-size: .78rem;
    color: var(--ink-mid);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .arch-bar-track {
    height: 8px;
    background: var(--surface-3);
    border-radius: 4px;
    overflow: hidden;
  }

  .arch-bar-fill {
    height: 100%;
    border-radius: 4px;
    background: var(--accent);
    transition: width 600ms cubic-bezier(.4,0,.2,1);
  }

  .arch-bar-fill.best { background: linear-gradient(90deg, var(--accent), #3b82f6); }

  .arch-bar-pct {
    font-size: .75rem;
    font-weight: 600;
    color: var(--ink-faint);
    width: 32px;
    text-align: right;
  }

  /* ── Skill chips ── */
  .chip-group { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: .5rem; }

  .chip {
    font-size: .75rem;
    font-weight: 500;
    border-radius: 6px;
    padding: .2rem .65rem;
  }

  .chip-matched {
    background: rgba(5,150,105,.1);
    color: var(--success);
    border: 1px solid rgba(5,150,105,.2);
  }

  .chip-missing {
    background: rgba(217,119,6,.08);
    color: var(--warn);
    border: 1px solid rgba(217,119,6,.2);
  }

  .skill-row { margin-bottom: .75rem; }
  .skill-row:last-child { margin-bottom: 0; }

  .skill-row-label {
    font-size: .78rem;
    font-weight: 600;
    color: var(--ink-mid);
    margin-bottom: .35rem;
  }

  /* ── Roles ── */
  .roles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: .6rem;
  }

  .role-chip {
    background: var(--surface-2);
    border: 1px solid var(--surface-3);
    border-radius: var(--radius);
    padding: .6rem .9rem;
    font-size: .83rem;
    font-weight: 500;
    color: var(--ink);
    transition: all var(--transition);
  }

  .role-chip:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-glow);
  }

  /* ── Salary ── */
  .salary-display {
    display: flex;
    align-items: baseline;
    gap: .5rem;
    margin-bottom: .4rem;
  }

  .salary-range {
    font-family: var(--font-head);
    font-size: 1.7rem;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -.02em;
  }

  .salary-unit {
    font-size: .85rem;
    color: var(--ink-faint);
  }

  .salary-note {
    font-size: .78rem;
    color: var(--ink-faint);
  }

  /* ── Similar & Live jobs ── */
  .job-list { display: flex; flex-direction: column; gap: .75rem; }

  .job-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: .85rem 1rem;
    background: var(--surface-2);
    border: 1px solid var(--surface-3);
    border-radius: var(--radius);
    transition: all var(--transition);
    text-decoration: none;
    color: inherit;
  }

  .job-item:hover, a.job-item:hover {
    border-color: var(--accent);
    background: var(--accent-glow);
  }

  .job-title {
    font-size: .88rem;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: .2rem;
  }

  .job-meta {
    font-size: .77rem;
    color: var(--ink-faint);
  }

  .job-salary {
    font-size: .78rem;
    font-weight: 600;
    color: var(--success);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .live-arrow {
    font-size: .8rem;
    color: var(--accent);
    flex-shrink: 0;
    margin-top: 2px;
  }

  /* ── Two-col ── */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  @media (max-width: 520px) {
    .two-col { grid-template-columns: 1fr; }
    .arch-bar-row { grid-template-columns: 1fr 2fr auto; }
  }
`;

function fmt(n) {
  if (n == null) return null;
  return "€" + Math.round(n).toLocaleString("de-DE");
}

export default function ReportScreen({ report, onBack }) {
  const {
    archetype_name,
    archetype_description,
    fit_label,
    fit_score,
    matched_skills,
    missing_skills,
    target_roles,
    archetype_scores,
    similar_jobs,
    salary_range,
    live_jobs,
  } = report;

  return (
    <>
      <style>{css}</style>
      <div className="report-screen">

        <button className="back-btn" onClick={onBack}>
          ← New analysis
        </button>

        {/* ── Archetype hero ── */}
        <div className="archetype-hero">
          <p className="archetype-hero-eyebrow">Your AI Career Archetype</p>
          <h2 className="archetype-name">{archetype_name}</h2>
          <p className="archetype-desc">{archetype_description}</p>
          <div className="fit-badge">
            ✦ {fit_label} · {Math.round(fit_score * 100)}% skill overlap
          </div>
        </div>

        {/* ── All archetype scores ── */}
        <div className="card">
          <p className="card-title">Archetype match scores</p>
          <div className="archetype-bars">
            {archetype_scores.map((a, i) => (
              <div className="arch-bar-row" key={a.id}>
                <span className="arch-bar-label" title={a.name}>{a.name}</span>
                <div className="arch-bar-track">
                  <div
                    className={`arch-bar-fill ${i === 0 ? "best" : ""}`}
                    style={{ width: `${Math.round(a.score * 100)}%` }}
                  />
                </div>
                <span className="arch-bar-pct">{Math.round(a.score * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Skills ── */}
        <div className="two-col">
          <div className="card">
            <p className="card-title">Your matched skills</p>
            {matched_skills.length > 0 ? (
              <div className="chip-group">
                {matched_skills.map(s => (
                  <span className="chip chip-matched" key={s}>✓ {s}</span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: ".82rem", color: "var(--ink-faint)" }}>
                No keyword matches found — try adding more technical skills to your input.
              </p>
            )}
          </div>

          <div className="card">
            <p className="card-title">Skills to develop</p>
            {missing_skills.length > 0 ? (
              <div className="chip-group">
                {missing_skills.map(s => (
                  <span className="chip chip-missing" key={s}>+ {s}</span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: ".82rem", color: "var(--success)" }}>
                Full skill coverage for this archetype.
              </p>
            )}
          </div>
        </div>

        {/* ── Target roles ── */}
        <div className="card">
          <p className="card-title">Target roles in this archetype</p>
          <div className="roles-grid">
            {target_roles.map(r => (
              <div className="role-chip" key={r}>{r}</div>
            ))}
          </div>
        </div>

        {/* ── Salary ── */}
        {salary_range && (
          <div className="card">
            <p className="card-title">Estimated salary range</p>
            <div className="salary-display">
              <span className="salary-range">
                {fmt(salary_range.min)} – {fmt(salary_range.max)}
              </span>
              <span className="salary-unit">/ year</span>
            </div>
            <p className="salary-note">
              25th–75th percentile from {similar_jobs.length} semantically matched postings in the EACIS dataset.
            </p>
          </div>
        )}

        {/* ── Semantically similar jobs ── */}
        {similar_jobs.length > 0 && (
          <div className="card">
            <p className="card-title">Semantically similar roles (from dataset)</p>
            <div className="job-list">
              {similar_jobs.map((j, i) => (
                <div className="job-item" key={i}>
                  <div>
                    <div className="job-title">{j.title || "Untitled"}</div>
                    <div className="job-meta">
                      {[j.company, j.location].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  {(j.salary_min || j.salary_max) && (
                    <span className="job-salary">
                      {fmt(j.salary_min)}{j.salary_max ? ` – ${fmt(j.salary_max)}` : ""}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Live jobs ── */}
        <div className="card">
          <p className="card-title">
            {live_jobs.length > 0
              ? `Live openings right now (${live_jobs.length})`
              : "Live openings"}
          </p>
          {live_jobs.length > 0 ? (
            <div className="job-list">
              {live_jobs.map((j, i) => (
                <a
                  className="job-item"
                  key={i}
                  href={j.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div>
                    <div className="job-title">{j.title}</div>
                    <div className="job-meta">
                      {[j.company, j.location].filter(Boolean).join(" · ")}
                    </div>
                    {(j.salary_min || j.salary_max) && (
                      <div className="job-salary" style={{ marginTop: ".25rem" }}>
                        {fmt(j.salary_min)}{j.salary_max ? ` – ${fmt(j.salary_max)}` : ""}
                      </div>
                    )}
                  </div>
                  <span className="live-arrow">↗</span>
                </a>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: ".84rem", color: "var(--ink-faint)" }}>
              No live results returned by Adzuna for this query. Try re-running with a different country.
            </p>
          )}
        </div>

      </div>
    </>
  );
}
