import { useState, type FormEvent } from 'react';

interface ShortenUrlProps {
  onSubmit: (url: string) => void;
}

export default function ShortenUrl({ onSubmit }: ShortenUrlProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(url.trim());
      setUrl('');
    } catch {
      setError('Failed to shorten URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError(null);
  };

  return (
    <form className="url-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="url-input" className="form-label">
          Long URL
        </label>
        <div className="input-wrapper">
          <span className="input-prefix" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
              <path d="M21 12a9 9 0 01-9 9c-2.52 0-4.93-.87-6.74-2.33A9 9 0 0012 3c2.52 0 4.93.87 6.74 2.33A9 9 0 0121 12z" />
              <path d="M21 3a9 9 0 00-9 9c-.92 0-1.85-.13-2.74-.37" />
            </svg>
          </span>
          <input
            id="url-input"
            type="url"
            className="form-input"
            placeholder="https://example.com/very/long/url/that/needs/shortening"
            value={url}
            onChange={handleChange}
            required
            disabled={isLoading}
            aria-describedby={error ? 'url-error' : 'url-hint'}
            autoComplete="url"
            autoFocus
          />
        </div>
        <p id="url-hint" className="form-hint">
          Paste a long URL to create a short, shareable link
        </p>
        {error && (
          <p id="url-error" className="form-error" role="alert">
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
            Shortening...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true" className="btn-icon">
              <path d="M21 12a9 9 0 01-9 9c-2.52 0-4.93-.87-6.74-2.33A9 9 0 0012 3c2.52 0 4.93.87 6.74 2.33A9 9 0 0121 12z" />
              <path d="M21 3a9 9 0 00-9 9c-.92 0-1.85-.13-2.74-.37" />
            </svg>
            Shorten URL
          </>
        )}
      </button>
    </form>
  );
}