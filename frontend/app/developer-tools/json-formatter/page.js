"use client";
import { useState } from "react";

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setOutput("Invalid JSON");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>JSON Formatter</h1>

      <textarea
        rows={6}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={formatJSON}>Format</button>

      <pre>{output}</pre>
    </div>
  );
}