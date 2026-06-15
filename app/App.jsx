import { useState } from "react";
import InputScreen from "./components/InputScreen.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import ReportScreen from "./components/ReportScreen.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:        #0d1117;
    --ink-mid:    #3d4451;
    --ink-faint:  #6b7280;
    --surface:    #ffffff;
    --surface-2:  #f6f8fa;
    --surface-3:  #eef0f3;
    --accent:     #1a56db;
    --accent-2:   #0e3a8c;
    --accent-glow:rgba(26,86,219,0.12);
    --eu-gold:    #f59e0b;
    --success:    #059669;
    --warn:       #d97706;
    --danger:     #dc2626;
    --radius:     10px;
    --radius-lg:  18px;
    --shadow:     0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06);
    --shadow-lg:  0 8px 32px rgba(0,0,0,.10);
    --font-head:  'Space Grotesk', system-ui, sans-serif;
    --font-body:  'Inter', system-ui, sans-serif;
    --transition: 220ms cubic-bezier(.4,0,.2,1);
  }

  html, body { height: 100%; }

  body {
    font-family: var(--font-body);
    background: var(--surface-2);
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  #root { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── Header ── */
  .site-header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--surface-3);
    padding: 0 2rem;
    height: 56px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .logo {
    font-family: var(--font-head);
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -.01em;
    color: var(--ink);
    display: flex; align-items: center; gap: .5rem;
  }

  .logo-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .logo-sub {
    font-size: .7rem;
    font-weight: 400;
    color: var(--ink-faint);
    letter-spacing: .06em;
    text-transform: uppercase;
    margin-left: .25rem;
  }

  .eu-badge {
    font-size: .72rem;
    font-weight: 500;
    color: var(--accent);
    background: var(--accent-glow);
    border: 1px solid rgba(26,86,219,.2);
    border-radius: 20px;
    padding: .2rem .7rem;
    letter-spacing: .03em;
  }

  /* ── Page wrapper ── */
  .page {
    flex: 1;
    max-width: 720px;
    width: 100%;
    margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
  }

  /* ── Error box ── */
  .error-card {
    background: #fff5f5;
    border: 1px solid #fca5a5;
    border-radius: var(--radius);
    padding: 1.5rem;
    margin-top: 2rem;
    text-align: center;
  }

  .error-card h3 { color: var(--danger); font-family: var(--font-head); margin-bottom: .5rem; }
  .error-card p  { color: var(--ink-mid); font-size: .9rem; margin-bottom: 1rem; }

  .btn-ghost {
    background: transparent;
    border: 1.5px solid var(--ink-mid);
    color: var(--ink);
    border-radius: var(--radius);
    padding: .6rem 1.4rem;
    font-size: .88rem;
    font-family: var(--font-body);
    cursor: pointer;
    transition: all var(--transition);
  }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

  /* ── Footer ── */
  .site-footer {
    text-align: center;
    padding: 2rem;
    font-size: .78rem;
    color: var(--ink-faint);
    border-top: 1px solid var(--surface-3);
  }
  .site-footer a { color: var(--accent); text-decoration: none; }
`;

export default function App() {
  const [screen, setScreen]   = useState("input");
  const [steps,  setSteps]    = useState([]);
  const [report, setReport]   = useState(null);
  const [error,  setError]    = useState("");

  const handleSubmit = async ({ text, country }) => {
    setSteps([]);
    setScreen("loading");

    try {
      const res = await fetch(`${API_BASE}/analyse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, country }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }

      const data = await res.json();

      // Animate the reasoning trace
      for (let i = 0; i < data.reasoning_trace.length; i++) {
        await new Promise(r => setTimeout(r, 400));
        setSteps(prev => [...prev, data.reasoning_trace[i]]);
      }

      await new Promise(r => setTimeout(r, 600));
      setReport(data);
      setScreen("report");
    } catch (err) {
      setError(err.message);
      setScreen("error");
    }
  };

  return (
    <>
      <style>{css}</style>

      <header className="site-header">
        <div className="logo">
          <span className="logo-dot" />
          EACIS
          <span className="logo-sub">European AI Career Intelligence</span>
        </div>
        <span className="eu-badge">EU AI Act Aligned</span>
      </header>

      <main className="page">
        {screen === "input"   && <InputScreen onSubmit={handleSubmit} />}
        {screen === "loading" && <LoadingScreen steps={steps} />}
        {screen === "report"  && <ReportScreen report={report} onBack={() => setScreen("input")} />}
        {screen === "error"   && (
          <div className="error-card">
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="btn-ghost" onClick={() => setScreen("input")}>← Try again</button>
          </div>
        )}
      </main>

      <footer className="site-footer">
        EACIS · European AI Career Intelligence System ·{" "}
        <a href="https://github.com/N1n4CH/applied-industry-system-design" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </footer>
    </>
  );
}
