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
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">✍️ Handwriting Generator</h1>

      {/* Tool Card */}
      <div className="bg-white dark:bg-zinc-900 border shadow-lg rounded-xl p-6 space-y-4">

        <textarea
          rows={6}
          placeholder="Type your text here..."
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={generate}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Generate Handwriting
        </button>

        {/* Output */}
        {output && (
          <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Preview</p>
            <div className="text-2xl font-[cursive] leading-relaxed">
              {output}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}