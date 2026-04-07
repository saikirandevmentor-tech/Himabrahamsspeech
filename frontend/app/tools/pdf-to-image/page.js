'use client';
import { useState, useRef } from 'react';

export default function PdfToImage() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle');
  const [images, setImages] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setStatus('idle');
      setImages([]);
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

  const handleConvert = async () => {
    if (!file) return;
    setStatus('uploading');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await fetch('http://localhost:5000/api/pdf/pdf-to-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Conversion failed');

      const data = await res.json();
      setImages(data.images); // array of base64 or URLs
      setStatus('success');
    } catch (err) {
      setErrorMsg('Conversion failed. Please try again.');
      setStatus('error');
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>PDF to Image</h1>
        <p style={styles.subtitle}>Convert each page of your PDF into a high-quality PNG image.</p>

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
          <div style={styles.dropIcon}>🖼️</div>
          {file ? (
            <p style={styles.fileName}>{file.name}</p>
          ) : (
            <p style={styles.dropText}>Drag & drop a PDF here, or <span style={styles.link}>browse</span></p>
          )}
        </div>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <button
          style={{ ...styles.btn, ...((!file || status === 'uploading') ? styles.btnDisabled : {}) }}
          onClick={handleConvert}
          disabled={!file || status === 'uploading'}
        >
          {status === 'uploading' ? 'Converting...' : 'Convert to Images'}
        </button>

        {status === 'success' && images.length > 0 && (
          <div style={styles.gallery}>
            {images.map((src, i) => (
              <div key={i} style={styles.imgWrapper}>
                <img src={src} alt={`Page ${i + 1}`} style={styles.img} />
                <a href={src} download={`page-${i + 1}.png`} style={styles.downloadBtn}>
                  ⬇ Page {i + 1}
                </a>
              </div>
            ))}
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: '#fff8f0',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '2rem',
  },
  card: {
    background: '#fff',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    maxWidth: '520px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(180,100,30,0.10)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    marginTop: '2rem',
  },
  title: { fontSize: '2rem', fontWeight: 800, color: '#bf360c', margin: 0 },
  subtitle: { color: '#555', textAlign: 'center', margin: 0 },
  dropzone: {
    width: '100%',
    border: '2.5px dashed #ff8a65',
    borderRadius: '1rem',
    padding: '2.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    background: '#fff3e0',
    transition: 'background 0.2s',
  },
  dropzoneDragging: { background: '#ffe0b2' },
  dropIcon: { fontSize: '2.5rem', marginBottom: '0.5rem' },
  dropText: { color: '#888', fontSize: '0.97rem' },
  fileName: { color: '#e64a19', fontWeight: 600, wordBreak: 'break-all', textAlign: 'center' },
  link: { color: '#e64a19', textDecoration: 'underline', cursor: 'pointer' },
  btn: {
    width: '100%',
    padding: '0.85rem',
    background: '#e64a19',
    color: '#fff',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnDisabled: { background: '#b0bec5', cursor: 'not-allowed' },
  gallery: { width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' },
  imgWrapper: { display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' },
  img: { width: '100%', borderRadius: '0.5rem', border: '1px solid #ddd' },
  downloadBtn: {
    padding: '0.5rem 1.5rem',
    background: '#43a047',
    color: '#fff',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  error: { color: '#e53935', fontSize: '0.9rem' },
};
