"use client";
import { useState } from "react";
import Image from "next/image";

export default function ImageToPDF() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const upload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("http://localhost:5000/api/pdf/image-to-pdf", {
        method: "POST",
        body: formData,
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      a.click();
    } catch (error) {
      console.error("Conversion failed:", error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">🖼️ Image to PDF</h1>

      <div className="bg-white dark:bg-zinc-900 border shadow-lg rounded-xl p-6 space-y-4">

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border rounded-lg p-2"
        />

        {/* Image Preview */}
        {preview && (
          <div className="flex justify-center">
            <Image
              src={preview}
              alt="Preview"
              width={250}
              height={250}
              className="rounded-lg border object-contain"
              unoptimized
            />
          </div>
        )}

        <button
          onClick={upload}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Converting..." : "Convert to PDF"}
        </button>

      </div>
    </div>
  );
}