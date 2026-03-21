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
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">🧩 JSON Formatter</h1>

      {/* Tool Card */}
      <div className="bg-white dark:bg-zinc-900 border shadow-lg rounded-xl p-6 space-y-4">

        {/* Input */}
        <textarea
          rows={8}
          placeholder="Paste your JSON here..."
          className="w-full border rounded-lg p-3 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={formatJSON}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Format JSON
        </button>

        {/* Output */}
        {output && (
          <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-lg overflow-auto">
            <p className="text-sm text-gray-500 mb-2">Formatted Output</p>
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}