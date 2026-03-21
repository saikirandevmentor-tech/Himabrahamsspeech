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
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">📝 Word Counter</h1>

      {/* Tool Card */}
      <div className="bg-white dark:bg-zinc-900 border shadow-lg rounded-xl p-6 space-y-4">

        <textarea
          rows={6}
          placeholder="Type or paste your text here..."
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={calculate}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Count Words
        </button>

        {/* Result */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Words</p>
            <p className="text-2xl font-semibold">{result.words}</p>
          </div>

          <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Characters</p>
            <p className="text-2xl font-semibold">{result.chars}</p>
          </div>
        </div>

      </div>
    </div>
  );
}