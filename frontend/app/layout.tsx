import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Him Abrahams Speech",
  description: "Free online productivity tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">

        {/* Navbar */}
        <header className="border-b">
          <nav className="max-w-6xl mx-auto flex justify-between items-center p-4">
            <Link href="/" className="font-bold text-lg">
              ⚡ Him Abrahams
            </Link>

            <div className="flex gap-6 text-sm">
              <Link href="/text-tools/word-counter">Text Tools</Link>
              <Link href="/generators/password-generator">Generators</Link>
              <Link href="/developer-tools/json-formatter">Dev Tools</Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <footer className="border-t text-center text-sm p-4 text-gray-500">
          © {new Date().getFullYear()} Him Abrahams Speech
        </footer>

      </body>
    </html>
  );
}