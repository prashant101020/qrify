import { useState, useEffect, type FormEvent } from 'react';
import { generateQrCode } from './api';

interface GenerateQRProps {
  onSubmit: (url: string) => void;
}

export default function GenerateQR({ onSubmit }: GenerateQRProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setQrCode(null);
    setQrDataUrl(null);

    try {
      const dataUrl = await generateQrCode(url.trim());
      setQrCode(dataUrl);
      setQrDataUrl(dataUrl);
      onSubmit(url.trim());
    } catch {
      setError('Failed to generate QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError(null);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyImage = async () => {
    if (!qrDataUrl) return;
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      // Use ClipboardItem API if available
      if (typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      } else {
        // Fallback: copy data URL
        await navigator.clipboard.writeText(qrDataUrl);
      }
    } catch {
      // Fallback: copy data URL
      await navigator.clipboard.writeText(qrDataUrl);
    }
  };

  const handleNew = () => {
    setQrCode(null);
    setQrDataUrl(null);
    setUrl('');
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (qrDataUrl) URL.revokeObjectURL(qrDataUrl);
    };
  }, [qrDataUrl]);

  return (
    <div className="qr-generator">
      {!qrCode ? (
        <form className="qr-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="qr-url-input" className="form-label">
              URL to encode
            </label>
            <div className="input-wrapper">
              <span className="input-prefix" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </span>
              <input
                id="qr-url-input"
                type="url"
                className="form-input"
                placeholder="https://example.com"
                value={url}
                onChange={handleChange}
                required
                disabled={isLoading}
                aria-describedby={error ? 'qr-error' : 'qr-hint'}
                autoComplete="url"
                autoFocus
              />
            </div>
            <p id="qr-hint" className="form-hint">
              Enter any URL to generate a scannable QR code
            </p>
            {error && (
              <p id="qr-error" className="form-error" role="alert">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading || !url.trim()}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner" aria-hidden="true"></span>
                Generating...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true" className="btn-icon">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                Generate QR Code
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="qr-result">
          <div className="qr-image-wrapper">
            <img
              src={qrCode}
              alt="Generated QR code"
              className="qr-image"
              width={256}
              height={256}
            />
          </div>

          <div className="qr-meta">
            <p className="qr-url">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true" className="qr-url-icon">
                <path d="M21 12a9 9 0 01-9 9c-2.52 0-4.93-.87-6.74-2.33A9 9 0 0012 3c2.52 0 4.93.87 6.74 2.33A9 9 0 0121 12z" />
                <path d="M21 3a9 9 0 00-9 9c-.92 0-1.85-.13-2.74-.37" />
              </svg>
              <span>{url}</span>
            </p>
          </div>

          <div className="qr-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleDownload}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true" className="btn-icon">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PNG
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCopyImage}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true" className="btn-icon">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copy Image
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleNew}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true" className="btn-icon">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
              Create Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}