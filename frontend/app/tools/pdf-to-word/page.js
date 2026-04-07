"use client";
import { useState, useRef } from "react";

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setStatus("idle");
      setDownloadUrl(null);
      setErrorMsg("");
    } else {
      setErrorMsg("Please upload a valid PDF file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleConvert = async () => {
    if (!file) return;

    setStatus("uploading");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("http://localhost:5000/api/pdf/pdf-to-word", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Conversion failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setStatus("success");
    } catch (err) {
      setErrorMsg("Conversion failed. Please try again.");
      setStatus("error");
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>PDF to Word</h1>

        <p style={styles.subtitle}>
          Convert your PDF documents into editable Word files instantly.
        </p>

        <div
          style={{
            ...styles.dropzone,
            ...(isDragging ? styles.dropzoneDragging : {}),
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />

          <div style={styles.dropIcon}>📄</div>

          {file ? (
            <p style={styles.fileName}>{file.name}</p>
          ) : (
            <p style={styles.dropText}>
              Drag & drop a PDF here, or{" "}
              <span style={styles.link}>browse</span>
            </p>
          )}
        </div>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <button
          style={{
            ...styles.btn,
            ...(!file || status === "uploading"
              ? styles.btnDisabled
              : {}),
          }}
          onClick={handleConvert}
          disabled={!file || status === "uploading"}
        >
          {status === "uploading"
            ? "Converting..."
            : "Convert to Word"}
        </button>

        {status === "success" && downloadUrl && (
          <a
            href={downloadUrl}
            download="converted.docx"
            style={styles.downloadBtn}
          >
            ⬇ Download Word File
          </a>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f4ff",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "2rem",
  },
  card: {
    background: "#fff",
    borderRadius: "1.5rem",
    padding: "2.5rem",
    maxWidth: "480px",
    width: "100%",
    boxShadow: "0 8px 32px rgba(60,80,180,0.10)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.2rem",
  },
  title: { fontSize: "2rem", fontWeight: 800, color: "#1a237e", margin: 0 },
  subtitle: { color: "#555", textAlign: "center", margin: 0 },
  dropzone: {
    width: "100%",
    border: "2.5px dashed #7986cb",
    borderRadius: "1rem",
    padding: "2.5rem 1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    background: "#f5f7ff",
  },
  dropzoneDragging: { background: "#e8eaf6" },
  dropIcon: { fontSize: "2.5rem", marginBottom: "0.5rem" },
  dropText: { color: "#888", fontSize: "0.97rem" },
  fileName: {
    color: "#3949ab",
    fontWeight: 600,
    wordBreak: "break-all",
    textAlign: "center",
  },
  link: { color: "#3f51b5", textDecoration: "underline", cursor: "pointer" },
  btn: {
    width: "100%",
    padding: "0.85rem",
    background: "#3f51b5",
    color: "#fff",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  btnDisabled: { background: "#b0bec5", cursor: "not-allowed" },
  downloadBtn: {
    display: "block",
    width: "100%",
    padding: "0.85rem",
    background: "#43a047",
    color: "#fff",
    borderRadius: "0.75rem",
    textAlign: "center",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "1rem",
  },
  error: { color: "#e53935", fontSize: "0.9rem" },
};