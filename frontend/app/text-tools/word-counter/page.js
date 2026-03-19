"use client";
import { useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [result, setResult] = useState({ words: 0, chars: 0 });

  const calculate = async () => {
    const res = await fetch("http://localhost:5000/api/text/word-counter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Word Counter</h1>

      <textarea
        rows={6}
        style={{ width: "100%" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={calculate}>Count</button>

      <p>Words: {result.words}</p>
      <p>Characters: {result.chars}</p>
    </div>
  );
}