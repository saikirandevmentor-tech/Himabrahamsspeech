'use client';
import { useState, useRef } from 'react';

export default function CompressImage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [quality, setQuality] = useState(80);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const handleFile = (f) => {
    if (f && ACCEPTED.includes(f.type)) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setStatus('idle');
      setResult(null);
      setErrorMsg('');
    } else {
      setErrorMsg('Please upload a JPG, PNG, or WebP image.');
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
    formData.append('image', file);
    formData.append('quality', quality);

    try {
      const res = await fetch('http://localhost:5000/api/tools/compress-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Compression failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, originalSize: file.size, compressedSize: blob.size, type: blob.type });
      setStatus('success');
    } catch (err) {
      setErrorMsg('Compression failed. Please try again.');
      setStatus('error');
    }
  };

  const ext = file?.name.split('.').pop() || 'img';
  const savings = result ? Math.round((1 - result.compressedSize / result.originalSize) * 100) : 0;

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>Compress Image</h1>
        <p style={styles.subtitle}>Shrink JPG, PNG, or WebP images without visible quality loss.</p>

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
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {preview ? (
            <img src={preview} alt="preview" style={styles.previewImg} />
          ) : (
            <>
              <div style={styles.dropIcon}>🖼️</div>
              <p style={styles.dropText}>Drag & drop an image, or <span style={styles.link}>browse</span></p>
              <p style={styles.dropHint}>JPG, PNG, WebP supported</p>
            </>
          )}
          {file && <p style={styles.fileName}>{file.name} ({formatSize(file.size)})</p>}
        </div>

        <div style={styles.sliderRow}>
          <label style={styles.sliderLabel}>Quality: <strong>{quality}%</strong></label>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.sliderHints}>
            <span>Smaller file</span><span>Better quality</span>
          </div>
        </div>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <button
          style={{ ...styles.btn, ...((!file || status === 'uploading') ? styles.btnDisabled : {}) }}
          onClick={handleCompress}
          disabled={!file || status === 'uploading'}
        >
          {status === 'uploading' ? 'Compressing...' : 'Compress Image'}
        </button>

        {status === 'success' && result && (
          <div style={styles.resultBox}>
            <div style={styles.resultRow}><span>Original:</span><strong>{formatSize(result.originalSize)}</strong></div>
            <div style={styles.resultRow}><span>Compressed:</span><strong>{formatSize(result.compressedSize)}</strong></div>
            <div style={{ ...styles.resultRow, color: '#1565c0', fontWeight: 700 }}>
              <span>Saved:</span><strong>{savings > 0 ? savings + '%' : 'Already optimal'}</strong>
            </div>
            <div style={styles.resultImages}>
              <div style={styles.resultImgCol}>
                <span style={styles.imgLabel}>Original</span>
                <img src={preview} alt="original" style={styles.resultImg} />
              </div>
              <div style={styles.resultImgCol}>
                <span style={styles.imgLabel}>Compressed</span>
                <img src={result.url} alt="compressed" style={styles.resultImg} />
              </div>
            </div>
            <a href={result.url} download={`compressed.${ext}`} style={styles.downloadBtn}>
              ⬇ Download Compressed Image
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: '#e3f2fd',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '2rem',
  },
  card: {
    background: '#fff',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    maxWidth: '520px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(30,100,200,0.10)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    marginTop: '2rem',
  },
  title: { fontSize: '2rem', fontWeight: 800, color: '#0d47a1', margin: 0 },
  subtitle: { color: '#555', textAlign: 'center', margin: 0 },
  dropzone: {
    width: '100%',
    border: '2.5px dashed #64b5f6',
    borderRadius: '1rem',
    padding: '2rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    background: '#e3f2fd',
    transition: 'background 0.2s',
    gap: '0.3rem',
  },
  dropzoneDragging: { background: '#bbdefb' },
  previewImg: { width: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '0.5rem' },
  dropIcon: { fontSize: '2.5rem' },
  dropText: { color: '#888', fontSize: '0.97rem' },
  dropHint: { color: '#aaa', fontSize: '0.82rem' },
  fileName: { color: '#1565c0', fontWeight: 600, wordBreak: 'break-all', textAlign: 'center', fontSize: '0.9rem' },
  link: { color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' },
  sliderRow: { width: '100%', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  sliderLabel: { color: '#555', fontSize: '0.95rem' },
  slider: { width: '100%', accentColor: '#1976d2' },
  sliderHints: { display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#aaa' },
  btn: {
    width: '100%',
    padding: '0.85rem',
    background: '#1976d2',
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
    background: '#e3f2fd',
    borderRadius: '0.75rem',
    padding: '1rem 1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  resultRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.97rem', color: '#444' },
  resultImages: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
  resultImgCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' },
  imgLabel: { fontSize: '0.8rem', color: '#888' },
  resultImg: { width: '100%', borderRadius: '0.4rem', border: '1px solid #ddd' },
  downloadBtn: {
    display: 'block',
    padding: '0.75rem',
    background: '#1565c0',
    color: '#fff',
    borderRadius: '0.75rem',
    textAlign: 'center',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '1rem',
  },
  error: { color: '#e53935', fontSize: '0.9rem' },
};
