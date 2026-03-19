import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Him Abrahams Speech</h1>
      <p>Free online tools for productivity 🚀</p>

      <h2>Text Tools</h2>
      <ul>
        <li>
          <Link href="/text-tools/word-counter">Word Counter</Link>
        </li>
        <li>
          <Link href="/text-tools/handwriting-generator">
            Handwriting Generator
          </Link>
        </li>
      </ul>

      <h2>Generators</h2>
      <ul>
        <li>
          <Link href="/generators/password-generator">
            Password Generator
          </Link>
        </li>
      </ul>

      <h2>Developer Tools</h2>
      <ul>
        <li>
          <Link href="/developer-tools/json-formatter">
            JSON Formatter
          </Link>
        </li>
      </ul>
    </main>
  );
}