import React, { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Use deployed backend if available, otherwise fallback to local for development
  const API_BASE =
    process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

  const handleDetect = async () => {
    setError("");
    setResult("");

    if (!text.trim()) {
      setError("Please enter some news text before detecting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      // expecting { result: "fake" } or { result: "real" }
      setResult((data.result || "").toLowerCase());
    } catch (err) {
      console.error("Error:", err);
      setError("Could not reach the detection server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResult("");
    setError("");
  };

  const isFake = result === "fake";
  const isReal = result === "real";

  return (
    <div className="app">
      <div className="app-overlay">
        <div className="card">
          <header className="card-header">
            <div>
              <h1>Fake News Detection</h1>
              <p className="subtitle">
                Paste any news statement or headline below and let the model
                classify it as <strong>fake</strong> or <strong>real</strong>.
              </p>
            </div>
            <span className="badge">ML Powered</span>
          </header>

          <div className="form-group">
            <label className="label">News text</label>
            <textarea
              className="textarea"
              rows={6}
              placeholder="Example: The government has officially announced a new cybersecurity policy..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="actions">
            <button
              className="btn primary"
              onClick={handleDetect}
              disabled={loading || !text.trim()}
            >
              {loading ? (
                <span className="spinner-wrapper">
                  <span className="spinner" /> Analyzing...
                </span>
              ) : (
                "Detect Fake News"
              )}
            </button>
            <button
              className="btn ghost"
              onClick={handleClear}
              disabled={loading && !text}
            >
              Clear
            </button>
          </div>

          {result && (
            <div
              className={
                "result-box " + (isFake ? "fake" : isReal ? "real" : "")
              }
            >
              <div className="result-header">
                <span className="pill">
                  {isFake ? "Fake News" : isReal ? "Real News" : "Result"}
                </span>
              </div>
              <p className="result-text">
                This statement has been classified as{" "}
                <strong>{result.toUpperCase()}</strong> by the model.
              </p>
              <p className="note">
                ⚠️ Note: This is a machine learning prediction and may not be
                100% accurate.
              </p>
            </div>
          )}

          {error && <div className="error-box">{error}</div>}

          <footer className="footer">
            <span>
              Built by <strong>Sanjay Kumar Tummala</strong> · React · Flask ·
              Machine Learning
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
