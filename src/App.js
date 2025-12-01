import React, { useState } from 'react';

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const detect = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      setResult("Error connecting to backend");
    }
  };

  return (
    <div style={{ padding:40 }}>
      <h1>Fake News Detection</h1>
      <textarea rows={6} cols={60} value={text} onChange={e=>setText(e.target.value)} />
      <br/><br/>
      <button onClick={detect}>Detect</button>
      <h2>{result}</h2>
    </div>
  );
}

export default App;
