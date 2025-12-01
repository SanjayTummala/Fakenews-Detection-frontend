import React, { useState } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("detect"); // detect | about | dataset | stack
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Use deployed backend if env var exists, otherwise local for dev
  const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

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
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setResult((data.result || "").toLowerCase());
    } catch (err) {
      console.error("Error calling backend:", err);
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
          {/* Header */}
          <header className="card-header">
            <div>
              <h1>Fake News Detection</h1>
              <p className="subtitle">
                ML-powered web app to classify news statements as{" "}
                <strong>fake</strong> or <strong>real</strong> using{" "}
                <strong>TF-IDF</strong> and{" "}
                <strong>Multinomial Naive Bayes</strong>.
              </p>
            </div>
            <div className="header-right">
              <span className="badge">ML Powered</span>
              <span className="status-pill">Deployed · Vercel & Render</span>
            </div>
          </header>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === "detect" ? "active" : ""}`}
              onClick={() => setActiveTab("detect")}
            >
              🔍 Detector
            </button>
            <button
              className={`tab ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              📘 About
            </button>
            <button
              className={`tab ${activeTab === "dataset" ? "active" : ""}`}
              onClick={() => setActiveTab("dataset")}
            >
              📊 Dataset & Samples
            </button>
            <button
              className={`tab ${activeTab === "stack" ? "active" : ""}`}
              onClick={() => setActiveTab("stack")}
            >
              🛠 Tech & Architecture
            </button>
          </div>

          {/* TAB: DETECTOR */}
          {activeTab === "detect" && (
            <>
              <div className="form-group">
                <label className="label">Enter news text</label>
                <textarea
                  className="textarea"
                  rows={6}
                  placeholder="Example: The government has officially announced a new national cybersecurity policy..."
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
                      <span className="spinner" />
                      Analyzing...
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
                  className={`result-box ${
                    isFake ? "fake" : isReal ? "real" : ""
                  }`}
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
                    ⚠️ This is an automated ML prediction. Please verify with
                    official and trusted sources before sharing.
                  </p>
                </div>
              )}

              {error && <div className="error-box">{error}</div>}
            </>
          )}

          {/* TAB: ABOUT */}
          {activeTab === "about" && (
            <div className="info-section">
              <h2>About this Project</h2>
              <p>
                This web app is part of an{" "}
                <strong>Advanced Fake News Detection</strong> project. It
                demonstrates how <strong>Machine Learning (ML)</strong> and{" "}
                <strong>Natural Language Processing (NLP)</strong> can be used
                to automatically identify potentially fake or misleading news.
              </p>
              <p>
                The system takes a news sentence or short article as input and
                converts it into numerical features using{" "}
                <strong>TF-IDF vectorization</strong>. A{" "}
                <strong>Multinomial Naive Bayes</strong> classifier then
                predicts whether it is likely to be <strong>fake</strong> or{" "}
                <strong>real</strong>.
              </p>
              <p>
                The frontend is built with <strong>React.js</strong> and sends
                requests to a <strong>Flask</strong> backend API. The backend
                loads a trained ML model and returns predictions as JSON. Both
                parts are fully deployed using <strong>Vercel</strong> (frontend)
                and <strong>Render</strong> (backend).
              </p>
            </div>
          )}

          {/* TAB: DATASET & SAMPLES */}
          {activeTab === "dataset" && (
            <div className="info-section">
              <h2>Dataset & Model</h2>
              <p>
                The model is trained on a combined dataset of{" "}
                <strong>~54,000+</strong> labeled news samples collected from
                multiple fake/real news datasets. Each record contains the news
                text and a label: <strong>fake</strong> or{" "}
                <strong>real</strong>.
              </p>
              <ul>
                <li>Text is cleaned, normalized, and converted to lowercase.</li>
                <li>
                  We use <strong>TF-IDF</strong> to transform text into numeric
                  vectors.
                </li>
                <li>
                  We train a <strong>Multinomial Naive Bayes</strong> model
                  using scikit-learn.
                </li>
                <li>
                  The trained model and vectorizer are saved as{" "}
                  <code>model.pkl</code> and <code>tfidf.pkl</code>, loaded by
                  the Flask backend.
                </li>
                <li>
                  Prediction endpoint:
                  <br />
                  <code>POST /predict</code> with JSON body{" "}
                  <code>{`{ "text": "your news here" }`}</code>.
                </li>
              </ul>

              <p className="note">
                🚀 Future work: add deep learning models (LSTM / BERT),
                multilingual support, and real-time news feed integration.
              </p>

              {/* SAMPLE EXAMPLES SECTION */}
              <div className="examples-section">
                <h3>Sample Fake & Real News Examples</h3>
                <p>
                  These examples illustrate the type of content that typically
                  appears as <strong>fake</strong> vs <strong>real</strong> in
                  the dataset.
                </p>

                <div className="examples-grid">
                  <div className="example-card fake-sample">
                    <h4>🔴 Fake News Samples</h4>
                    <ul>
                      <li>
                        “Scientists confirm that drinking only hot water for 3
                        days can completely cure all types of cancer.”
                      </li>
                      <li>
                        “A major national bank has announced that all loans
                        taken before 2020 are cancelled.”
                      </li>
                      <li>
                        “New secret law makes it illegal to use social media
                        after 9 PM without a special license.”
                      </li>
                      <li>
                        “Space agency admits that the Earth is flat and all
                        previous images were edited.”
                      </li>
                    </ul>
                  </div>

                  <div className="example-card real-sample">
                    <h4>🟢 Real News Samples</h4>
                    <ul>
                      <li>
                        “The central bank announced a 0.25% change in the repo
                        rate during its latest monetary policy meeting.”
                      </li>
                      <li>
                        “The Ministry of Health released updated guidelines on
                        vaccination schedules for children.”
                      </li>
                      <li>
                        “The election commission published the final list of
                        candidates contesting in the upcoming state elections.”
                      </li>
                      <li>
                        “The national transport authority introduced new
                        regulations for highway safety and speed limits.”
                      </li>
                      <li>
                        “The government signed a bilateral agreement to improve
                        cybersecurity cooperation between the two countries.”
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TECH & ARCHITECTURE */}
          {activeTab === "stack" && (
            <div className="info-section">
              <h2>Technologies & Architecture</h2>
              <p>
                This project is a fully deployed, ML-backed web application with
                clear separation between <strong>frontend</strong>,{" "}
                <strong>backend</strong>, and <strong>ML model</strong>.
              </p>

              <div className="stack-grid">
                <div className="stack-card">
                  <h3>🖥 Frontend</h3>
                  <ul>
                    <li>React.js Single Page Application</li>
                    <li>Custom responsive UI with CSS</li>
                    <li>Fetch API for calling backend</li>
                    <li>
                      Environment variable:{" "}
                      <code>REACT_APP_API_URL</code>
                    </li>
                    <li>Deployed on Vercel</li>
                  </ul>
                </div>

                <div className="stack-card">
                  <h3>⚙ Backend API</h3>
                  <ul>
                    <li>Python 3 + Flask</li>
                    <li>REST API endpoint: <code>/predict</code></li>
                    <li>Flask-CORS for cross-origin requests</li>
                    <li>Loads <code>model.pkl</code> and <code>tfidf.pkl</code></li>
                    <li>Deployed on Render</li>
                  </ul>
                </div>

                <div className="stack-card">
                  <h3>🤖 ML & NLP</h3>
                  <ul>
                    <li>Scikit-learn</li>
                    <li>TF-IDF Vectorizer</li>
                    <li>Multinomial Naive Bayes classifier</li>
                    <li>Trained on ~54k labeled samples</li>
                    <li>Model serialized using pickle</li>
                  </ul>
                </div>

                <div className="stack-card">
                  <h3>🧱 Architecture</h3>
                  <ul>
                    <li>
                      User → React UI → Flask API → ML Model → Prediction
                    </li>
                    <li>Stateless HTTP JSON communication</li>
                    <li>Loose coupling between frontend & backend</li>
                    <li>Easy to swap or upgrade models</li>
                    <li>Ideal for portfolio & academic demos</li>
                  </ul>
                </div>
              </div>

              <p className="note">
                💡 This section is designed to help reviewers, recruiters, and
                faculty quickly understand the end-to-end engineering of the
                project.
              </p>
            </div>
          )}

          {/* Footer */}
          <footer className="footer">
            <span>
              Built by <strong>Sanjay Kumar Tummala</strong> · React · Flask ·
              Scikit-learn · TF-IDF · Naive Bayes · Vercel · Render
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
