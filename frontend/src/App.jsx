import { useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "/svc/api";

export default function App() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function callStatus() {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch(`${BACKEND}/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header>
        <nav>
          <a href="/" className="logo">Vite + FastAPI</a>
        </nav>
      </header>
      <main>
        <h1>Vite + FastAPI</h1>
        <p className="subtitle">Validation boilerplate for Vercel Services</p>
        <div className="cards">
          <div className="card">
            <h3>FastAPI Backend</h3>
            <p>
              Calls <code>{BACKEND}/status</code> on the FastAPI service
              through the Vercel rewrite.
            </p>
            <button onClick={callStatus} disabled={loading}>
              {loading ? "Loading..." : "Call /svc/api/status →"}
            </button>
          </div>
        </div>
        {error && (
          <div className="response error">
            <pre>{error}</pre>
          </div>
        )}
        {response && (
          <div className="response">
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </main>
    </>
  );
}
