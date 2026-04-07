'use client';
import { useState, useRef } from 'react';

export default function CompressPdf() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [quality, setQuality] = useState('medium'); // low | medium | high
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null); // { url, originalSize, compressedSize }
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setStatus('idle');
      setResult(null);
      setErrorMsg('');
    } else {
      setErrorMsg('Please upload a valid PDF file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleCompress = async () => {
    if (!file) return;
    setStatus('uploading');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('quality', quality);

    try {
      const res = await fetch('http://localhost:5000/api/pdf/compress-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Compression failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const compressedSize = blob.size;

      setResult({ url, originalSize: file.size, compressedSize });
      setStatus('success');
    } catch (err) {
      setErrorMsg('Compression failed. Please try again.');
      setStatus('error');
    }
  };

  const savings = result
    ? Math.round((1 - result.compressedSize / result.originalSize) * 100)
    : 0;

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>Compress PDF</h1>
        <p style={styles.subtitle}>Reduce your PDF file size while keeping it readable.</p>

        <div
          style={{ ...styles.dropzone, ...(isDragging ? styles.dropzoneDragging : {}) }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div style={styles.dropIcon}>🗜️</div>
          {file ? (
            <p style={styles.fileName}>{file.name} <span style={styles.fileSize}>({formatSize(file.size)})</span></p>
          ) : (
            <p style={styles.dropText}>Drag & drop a PDF here, or <span style={styles.link}>browse</span></p>
          )}
        </div>

        <div style={styles.qualityRow}>
          <span style={styles.qualityLabel}>Compression Level:</span>
          {['low', 'medium', 'high'].map((q) => (
            <button
              key={q}
              style={{ ...styles.qualityBtn, ...(quality === q ? styles.qualityBtnActive : {}) }}
              onClick={() => setQuality(q)}
            >
              {q.charAt(0).toUpperCase() + q.slice(1)}
            </button>
          ))}
        </div>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <button
          style={{ ...styles.btn, ...((!file || status === 'uploading') ? styles.btnDisabled : {}) }}
          onClick={handleCompress}
          disabled={!file || status === 'uploading'}
        >
          {status === 'uploading' ? 'Compressing...' : 'Compress PDF'}
        </button>

        {status === 'success' && result && (
          <div style={styles.resultBox}>
            <div style={styles.resultRow}>
              <span>Original:</span><strong>{formatSize(result.originalSize)}</strong>
            </div>
            <div style={styles.resultRow}>
              <span>Compressed:</span><strong>{formatSize(result.compressedSize)}</strong>
            </div>
            <div style={{ ...styles.resultRow, color: '#2e7d32', fontWeight: 700 }}>
              <span>Saved:</span><strong>{savings}%</strong>
            </div>
            <a href={result.url} download="compressed.pdf" style={styles.downloadBtn}>
              ⬇ Download Compressed PDF
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f1f8e9',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '2rem',
  },
  card: {
    background: '#fff',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(50,150,50,0.10)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
  },
  title: { fontSize: '2rem', fontWeight: 800, color: '#1b5e20', margin: 0 },
  subtitle: { color: '#555', textAlign: 'center', margin: 0 },
  dropzone: {
    width: '100%',
    border: '2.5px dashed #81c784',
    borderRadius: '1rem',
    padding: '2.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    background: '#f9fbe7',
    transition: 'background 0.2s',
  },
  dropzoneDragging: { background: '#dcedc8' },
  dropIcon: { fontSize: '2.5rem', marginBottom: '0.5rem' },
  dropText: { color: '#888', fontSize: '0.97rem' },
  fileName: { color: '#388e3c', fontWeight: 600, wordBreak: 'break-all', textAlign: 'center' },
  fileSize: { color: '#888', fontWeight: 400, fontSize: '0.9rem' },
  link: { color: '#388e3c', textDecoration: 'underline', cursor: 'pointer' },
  qualityRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' },
  qualityLabel: { color: '#555', fontSize: '0.95rem' },
  qualityBtn: {
    padding: '0.4rem 1rem',
    border: '2px solid #81c784',
    borderRadius: '2rem',
    background: '#fff',
    color: '#388e3c',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  qualityBtnActive: { background: '#388e3c', color: '#fff', borderColor: '#388e3c' },
  btn: {
    width: '100%',
    padding: '0.85rem',
    background: '#388e3c',
    color: '#fff',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnDisabled: { background: '#b0bec5', cursor: 'not-allowed' },
  resultBox: {
    width: '100%',
    background: '#f1f8e9',
    borderRadius: '0.75rem',
    padding: '1rem 1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  resultRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.97rem', color: '#444' },
  downloadBtn: {
    display: 'block',
    marginTop: '0.5rem',
    padding: '0.75rem',
    background: '#43a047',
    color: '#fff',
    borderRadius: '0.75rem',
    textAlign: 'center',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '1rem',
  },
  error: { color: '#e53935', fontSize: '0.9rem' },
};
