import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">⚡ Him Abrahams Speech</h1>
        <p className="text-gray-500 mt-2">
          Free online tools for productivity 🚀
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* PDF Tools (NEW 🔥) */}
        <section className="bg-white dark:bg-zinc-900 shadow-md rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4">PDF Tools</h2>

          <ul className="space-y-2">
            <li>
              <Link
                href="/tools/image-to-pdf"
                className="text-blue-600 hover:underline"
              >
                Image to PDF
              </Link>
            </li>

            <li>
              <Link
                href="/tools/pdf-to-word"
                className="text-blue-600 hover:underline"
              >
                PDF to Word
              </Link>
            </li>

            <li>
              <Link
                href="/tools/compress-pdf"
                className="text-blue-600 hover:underline"
              >
                Compress PDF
              </Link>
            </li>
          </ul>
        </section>

        {/* Text Tools */}
        <section className="bg-white dark:bg-zinc-900 shadow-md rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4">Text Tools</h2>

          <ul className="space-y-2">
            <li>
              <Link
                href="/text-tools/word-counter"
                className="text-blue-600 hover:underline"
              >
                Word Counter
              </Link>
            </li>

            <li>
              <Link
                href="/text-tools/handwriting-generator"
                className="text-blue-600 hover:underline"
              >
                Handwriting Generator
              </Link>
            </li>
          </ul>
        </section>

        {/* Generators */}
        <section className="bg-white dark:bg-zinc-900 shadow-md rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4">Generators</h2>

          <ul className="space-y-2">
            <li>
              <Link
                href="/generators/password-generator"
                className="text-blue-600 hover:underline"
              >
                Password Generator
              </Link>
            </li>
          </ul>
        </section>

        {/* Developer Tools */}
        <section className="bg-white dark:bg-zinc-900 shadow-md rounded-xl p-6 border md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Developer Tools</h2>

          <ul className="space-y-2">
            <li>
              <Link
                href="/developer-tools/json-formatter"
                className="text-blue-600 hover:underline"
              >
                JSON Formatter
              </Link>
            </li>
          </ul>
        </section>
        {/* PDF & Conversion Tools */}
<section className="bg-white dark:bg-zinc-900 shadow-md rounded-xl p-6 border">
  <h2 className="text-xl font-semibold mb-4">PDF & Conversion Tools</h2>

  <ul className="space-y-2">
    <li>
      <Link href="/tools/image-to-pdf" className="text-blue-600 hover:underline">
        Image to PDF
      </Link>
    </li>

    <li>
      <Link href="/tools/pdf-to-word" className="text-blue-600 hover:underline">
        PDF to Word
      </Link>
    </li>

    <li>
      <Link href="/tools/pdf-to-image" className="text-blue-600 hover:underline">
        PDF to Image
      </Link>
    </li>

    <li>
      <Link href="/tools/compress-pdf" className="text-blue-600 hover:underline">
        Compress PDF
      </Link>
    </li>
  </ul>
        </section>
        {/* Image Tools */}
<section className="bg-white dark:bg-zinc-900 shadow-md rounded-xl p-6 border">
  <h2 className="text-xl font-semibold mb-4">Image Tools</h2>

  <ul className="space-y-2">
    <li>
      <Link href="/tools/jpg-to-png" className="text-blue-600 hover:underline">
        JPG to PNG
      </Link>
    </li>

    <li>
      <Link href="/tools/png-to-jpg" className="text-blue-600 hover:underline">
        PNG to JPG
      </Link>
    </li>

    <li>
      <Link href="/tools/jpg-to-jpeg" className="text-blue-600 hover:underline">
        JPG to JPEG
      </Link>
    </li>

    <li>
      <Link href="/tools/jpeg-to-jpg" className="text-blue-600 hover:underline">
        JPEG to JPG
      </Link>
    </li>

    <li>
      <Link href="/tools/compress-image" className="text-blue-600 hover:underline">
        Compress Image
      </Link>
    </li>
  </ul>
</section>

      </div>

    </main>
  );
}