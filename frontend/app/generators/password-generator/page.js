"use client";
import { useState } from "react";

export default function Password() {
  const [password, setPassword] = useState("");

  const generate = async () => {
    const res = await fetch("http://localhost:5000/api/tools/password");
    const data = await res.json();
    setPassword(data.password);
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">🔐 Password Generator</h1>

      {/* Card */}
      <div className="bg-white dark:bg-zinc-900 border shadow-lg rounded-xl p-6 space-y-4">

        <button
          onClick={generate}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Generate Password
        </button>

        {password && (
          <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Generated Password</p>
            <p className="text-xl font-mono break-all">{password}</p>
          </div>
        )}

      </div>
    </div>
  );
}