const css = `
  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 3rem;
  }

  .loading-icon {
    width: 56px;
    height: 56px;
    border: 3px solid var(--surface-3);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 900ms linear infinite;
    margin-bottom: 2rem;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-title {
    font-family: var(--font-head);
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: .4rem;
    text-align: center;
  }

  .loading-sub {
    font-size: .88rem;
    color: var(--ink-faint);
    margin-bottom: 2.5rem;
    text-align: center;
  }

  .steps-list {
    width: 100%;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    gap: .75rem;
  }

  .step {
    display: flex;
    align-items: flex-start;
    gap: .9rem;
    padding: .9rem 1rem;
    background: var(--surface);
    border: 1px solid var(--surface-3);
    border-radius: var(--radius);
    animation: slide-in 300ms ease both;
  }

  @keyframes slide-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .step-num {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    font-size: .72rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }

  .step-text { flex: 1; }

  .step-label {
    font-size: .88rem;
    font-weight: 600;
    color: var(--ink);
    line-height: 1.4;
  }

  .step-detail {
    font-size: .8rem;
    color: var(--ink-faint);
    margin-top: .2rem;
    line-height: 1.5;
  }

  .step-pending {
    display: flex;
    align-items: flex-start;
    gap: .9rem;
    padding: .9rem 1rem;
    background: var(--surface-2);
    border: 1px dashed var(--surface-3);
    border-radius: var(--radius);
  }

  .step-pending .step-num {
    background: var(--surface-3);
    color: var(--ink-faint);
  }

  .step-pending .step-label {
    color: var(--ink-faint);
    font-weight: 400;
  }

  .loading-disclaimer {
    margin-top: 2.5rem;
    font-size: .78rem;
    color: var(--ink-faint);
    text-align: center;
    max-width: 420px;
    line-height: 1.6;
  }
`;

const ALL_STEPS = [
  "Extracting skills from your profile…",
  "Matching against 5 European AI archetypes…",
  "Running semantic search across 1,088 European job postings…",
  "Calculating salary range from matched postings…",
  "Fetching live openings from Adzuna…",
  "Assembling your career report…",
];

export default function LoadingScreen({ steps }) {
  return (
    <>
      <style>{css}</style>
      <div className="loading-screen">
        <div className="loading-icon" />
        <h2 className="loading-title">Analysing your profile</h2>
        <p className="loading-sub">ReAct agent running — {ALL_STEPS.length} steps</p>

        <div className="steps-list">
          {ALL_STEPS.map((label, i) => {
            const done = steps[i];
            if (done) {
              return (
                <div className="step" key={i}>
                  <div className="step-num">✓</div>
                  <div className="step-text">
                    <div className="step-label">{done.step}</div>
                    {done.detail && <div className="step-detail">{done.detail}</div>}
                  </div>
                </div>
              );
            }
            const isNext = i === steps.length;
            return (
              <div className="step-pending" key={i}>
                <div className="step-num">{i + 1}</div>
                <div className="step-text">
                  <div className="step-label">{label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="loading-disclaimer">
          First request builds the DistilBERT embedding index from 1,088 job postings —
          this can take up to 30 seconds on the free Render tier.
        </p>
      </div>
    </>
  );
}
