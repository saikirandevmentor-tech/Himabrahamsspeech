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
    <div style={{ padding: 20 }}>
      <h1>Password Generator</h1>
      <button onClick={generate}>Generate</button>
      <p>{password}</p>
    </div>
  );
}