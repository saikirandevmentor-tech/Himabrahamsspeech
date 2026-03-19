"use client";
import { useState } from "react";

export default function Handwriting() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  const generate = async () => {
    const res = await fetch("http://localhost:5000/api/text/handwriting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setOutput(data.result);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Handwriting Generator</h1>

      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={generate}>Generate</button>

      <div style={{ fontFamily: "cursive", fontSize: 24 }}>
        {output}
      </div>
    </div>
  );
}