'use client';
import { useState, useRef } from 'react';

/**
 * ImageConverter - reusable component for image format conversions.
 * Props:
 *   fromFormat: string  e.g. "JPG"
 *   toFormat: string    e.g. "PNG"
 *   fromMime: string    e.g. "image/jpeg"
 *   toExt: string       e.g. "png"
 *   accentColor: string e.g. "#6a1b9a"
 *   bgColor: string     e.g. "#f3e5f5"
 *   endpoint: string    e.g. "/api/tools/jpg-to-png"
 */
export default function ImageConverter({
  fromFormat = 'JPG',
  toFormat = 'PNG',
  fromMime = 'image/jpeg',
  toExt = 'png',
  accentColor = '#6a1b9a',
  bgColor = '#f3e5f5',
  endpoint = '/api/tools/convert-image',
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (f && (f.type === fromMime || f.name.toLowerCase().endsWith(fromFormat.toLowerCase()))) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setStatus('idle');
      setDownloadUrl(null);
      setErrorMsg('');
    } else {
      setErrorMsg(`Please upload a valid ${fromFormat} file.`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus('converting');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('toFormat', toExt);

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Conversion failed');

      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      setStatus('success');
    } catch (err) {
      setErrorMsg('Conversion failed. Please try again.');
      setStatus('error');
    }
  };

  const lightBg = bgColor;
  const styles = makeStyles(accentColor, lightBg);

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.badge}>{fromFormat} → {toFormat}</div>
        <h1 style={styles.title}>{fromFormat} to {toFormat}</h1>
        <p style={styles.subtitle}>Instantly convert your {fromFormat} image to {toFormat} format — free and private.</p>

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
            accept={fromMime}
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {preview ? (
            <>
              <img src={preview} alt="preview" style={styles.previewImg} />
              <p style={styles.fileName}>{file.name}</p>
            </>
          ) : (
            <>
              <div style={styles.dropIcon}>🔄</div>
              <p style={styles.dropText}>
                Drop a <strong>.{fromFormat.toLowerCase()}</strong> file here, or <span style={styles.link}>browse</span>
              </p>
            </>
          )}
        </div>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <button
          style={{ ...styles.btn, ...((!file || status === 'converting') ? styles.btnDisabled : {}) }}
          onClick={handleConvert}
          disabled={!file || status === 'converting'}
        >
          {status === 'converting' ? 'Converting...' : `Convert to ${toFormat}`}
        </button>

        {status === 'success' && downloadUrl && (
          <div style={styles.successBox}>
            <span style={styles.checkmark}>✅</span>
            <span>Conversion complete!</span>
            <a href={downloadUrl} download={`converted.${toExt}`} style={styles.downloadBtn}>
              ⬇ Download {toFormat} File
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

function makeStyles(accent, bg) {
  return {
    main: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: bg,
      fontFamily: "'Segoe UI', sans-serif",
      padding: '2rem',
    },
    card: {
      background: '#fff',
      borderRadius: '1.5rem',
      padding: '2.5rem',
      maxWidth: '460px',
      width: '100%',
      boxShadow: `0 8px 32px ${accent}22`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.1rem',
    },
    badge: {
      background: accent,
      color: '#fff',
      borderRadius: '2rem',
      padding: '0.3rem 1rem',
      fontSize: '0.85rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    title: { fontSize: '1.8rem', fontWeight: 800, color: accent, margin: 0 },
    subtitle: { color: '#666', textAlign: 'center', margin: 0, fontSize: '0.95rem' },
    dropzone: {
      width: '100%',
      border: `2.5px dashed ${accent}88`,
      borderRadius: '1rem',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      background: bg,
      transition: 'background 0.2s',
      gap: '0.5rem',
    },
    dropzoneDragging: { background: `${accent}18` },
    previewImg: { maxWidth: '100%', maxHeight: '160px', objectFit: 'contain', borderRadius: '0.5rem' },
    dropIcon: { fontSize: '2.2rem' },
    dropText: { color: '#888', fontSize: '0.97rem', textAlign: 'center' },
    fileName: { color: accent, fontWeight: 600, wordBreak: 'break-all', textAlign: 'center', fontSize: '0.88rem' },
    link: { color: accent, textDecoration: 'underline', cursor: 'pointer' },
    btn: {
      width: '100%',
      padding: '0.85rem',
      background: accent,
      color: '#fff',
      border: 'none',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    },
    btnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
    successBox: {
      width: '100%',
      background: '#f1f8e9',
      borderRadius: '0.75rem',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.6rem',
      color: '#2e7d32',
      fontWeight: 600,
    },
    checkmark: { fontSize: '1.8rem' },
    downloadBtn: {
      display: 'block',
      width: '100%',
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
}
