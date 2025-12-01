import React, { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("detect"); // "detect" | "about" | "dataset" | "stack"

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
                A production-ready web app that uses{" "}
                <strong>Machine Learning</strong> and{" "}
                <strong>Natural Language Processing</strong> to classify news
                as <strong>fake</strong> or <strong>real</strong>.
              </p>
            </div>
            <div className="header-right">
              <span className="badge">ML Powered</span>
              <span className="status-pill">Deployed · Vercel + Render</span>
            </div>
          </header>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${tab === "detect" ? "active" : ""}`}
              onClick={() => setTab("detect")}
            >
              🔍 Detector
            </button>
            <button
              className={`tab ${tab === "about" ? "active" : ""}`}
              onClick={() => setTab("about")}
            >
              📘 About
            </button>
            <button
              className={`tab ${tab === "dataset" ? "active" : ""}`}
              onClick={() => setTab("dataset")}
            >
              📊 Dataset & Model
            </button>
            <button
              className={`tab ${tab === "stack" ? "active" : ""}`}
              onClick={() => setTab("stack")}
            >
              🛠 Tech & Architecture
            </button>
          </div>

          {/* DETECTOR TAB */}
          {tab === "detect" && (
            <>
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
                    ⚠️ Note: This is a machine learning prediction and may not
                    be 100% accurate. Always cross-check with trusted sources.
                  </p>
                </div>
              )}

              {error && <div className="error-box">{error}</div>}
            </>
          )}

          {/* ABOUT TAB */}
          {tab === "about" && (
            <div className="info-section">
              <h2>About this Project</h2>
              <p>
                This web application is part of an{" "}
                <strong>Advanced Fake News Detection</strong> project. It
                demonstrates how <strong>Machine Learning</strong> and{" "}
                <strong>NLP</strong> can be used to detect misinformation in
                online news and social media.
              </p>
              <p>
                The system takes a news statement as input, preprocesses the
                text, transforms it into numerical vectors using{" "}
                <strong>TF-IDF</strong>, and then applies a{" "}
                <strong>Multinomial Naive Bayes classifier</strong> to predict
                whether the statement is <strong>fake</strong> or{" "}
                <strong>real</strong>.
              </p>
              <p>
                The frontend is built with <strong>React.js</strong> and
                communicates with a <strong>Flask</strong> backend via a
                RESTful API deployed on <strong>Render</strong>. The entire UI
                and UX are designed to resemble a production-grade ML product.
              </p>
            </div>
          )}

          {/* DATASET & MODEL TAB */}
          {tab === "dataset" && (
            <div className="info-section">
              <h2>Dataset & Model Details</h2>
              <ul>
                <li>
                  Combined dataset built from multiple sources of{" "}
                  <strong>real</strong> and <strong>fake</strong> news
                  (headlines + full text).
                </li>
                <li>
                  Final training dataset size:{" "}
                  <strong>~54,000+ labeled samples</strong> of news articles and
                  statements.
                </li>
                <li>
                  Text is preprocessed and converted into numerical form using{" "}
                  <strong>TF-IDF (Term Frequency - Inverse Document Frequency)</strong>{" "}
                  with up to <code>20,000</code> features.
                </li>
                <li>
                  Core model: <strong>Multinomial Naive Bayes</strong>, chosen
                  for its strong performance on text classification tasks.
                </li>
                <li>
                  The trained model and TF-IDF vectorizer are stored in{" "}
                  <code>model.pkl</code> and <code>tfidf.pkl</code>, and loaded
                  by the Flask backend on startup.
                </li>
                <li>
                  API endpoint:
                  <br />
                  <code>POST /predict</code> with JSON body{" "}
                  <code>&#123; "text": "your news text" &#125;</code>
                </li>
              </ul>
              <p className="note">
                🚀 Future Enhancements: Integrate deep learning models (LSTM /
                BERT), multilingual support, and real-time news feed analysis.
              </p>

              {/* Sample Examples */}
              <div className="examples-section">
                <h3>Sample Fake & Real News Examples</h3>
                <p>
                  Here are some sample statements to demonstrate how the model
                  classifies typical <strong>fake</strong> vs{" "}
                  <strong>real</strong> news content.
                </p>

                <div className="examples-grid">
                  <div className="example-card fake-sample">
                    <h4>🔴 Fake News Samples</h4>
                    <ul>
                      <li>
                        “Government will deposit ₹5,00,000 into every citizen’s
                        bank account automatically from next week.”
                      </li>
                      <li>
                        “Scientists confirm that drinking only hot water for 3
                        days can completely cure all types of cancer.”
                      </li>
                      <li>
                        “A major bank has officially announced that all loans
                        taken before 2020 are now cancelled.”
                      </li>
                      <li>
                        “New law passed secretly at midnight makes social media
                        usage illegal after 9 PM.”
                      </li>
                      <li>
                        “International space agency admits that the Earth is
                        actually flat and photos were edited.”
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

          {/* TECH & ARCHITECTURE TAB */}
          {tab === "stack" && (
            <div className="info-section">
              <h2>Technologies & Architecture</h2>
              <p>
                This project is implemented as a full-stack, ML-powered web
                application with clear separation between{" "}
                <strong>frontend</strong>, <strong>backend</strong>, and{" "}
                <strong>ML model</strong>.
              </p>

              <div className="stack-grid">
                <div className="stack-card">
                  <h3>🖥 Frontend</h3>
                  <ul>
                    <li>React.js (SPA)</li>
                    <li>Modern responsive UI with custom CSS</li>
                    <li>Fetch API for calling backend</li>
                    <li>Environment variables for API URL</li>
                    <li>Deployed on <strong>Vercel</strong></li>
                  </ul>
                </div>

                <div className="stack-card">
                  <h3>⚙ Backend API</h3>
                  <ul>
                    <li>Python 3</li>
                    <li>Flask web framework</li>
                    <li>Flask-CORS for cross-origin access</li>
                    <li>Single endpoint: <code>/predict</code></li>
                    <li>Deployed on <strong>Render</strong></li>
                  </ul>
                </div>

                <div className="stack-card">
                  <h3>🤖 ML & NLP</h3>
                  <ul>
                    <li>Scikit-learn</li>
                    <li>TF-IDF vectorizer (text ➜ vectors)</li>
                    <li>Multinomial Naive Bayes classifier</li>
                    <li>Trained on ~54k labeled news samples</li>
                    <li>Model persisted as <code>.pkl</code> files</li>
                  </ul>
                </div>

                <div className="stack-card">
                  <h3>🧱 Architecture</h3>
                  <ul>
                    <li>
                      User ➜ React UI ➜ Flask API ➜ ML Model ➜ Prediction
                    </li>
                    <li>Clean separation of concerns</li>
                    <li>Stateless HTTP communication</li>
                    <li>Easy to extend with new models or pages</li>
                    <li>Suitable for showcasing in portfolio & interviews</li>
                  </ul>
                </div>
              </div>

              <p className="note">
                💡 This section is designed to help reviewers, recruiters, and
                faculty quickly understand the technologies and architecture
                behind the project.
              </p>
            </div>
          )}

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
