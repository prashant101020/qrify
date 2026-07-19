import { useState, useEffect, useCallback, useRef } from 'react';
import ShortenUrl from './ShortenUrl';
import GenerateQR from './GenerateQR';
import { shortenUrl } from './api';

type Tool = 'shorten' | 'qr';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

function App() {
  const [activeTool, setActiveTool] = useState<Tool>('shorten');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }, [theme]);

  const showToast = useCallback((type: Toast['type'], message: string) => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('success', `${label} copied to clipboard`);
    } catch {
      showToast('error', `Failed to copy ${label.toLowerCase()}`);
    }
  }, [showToast]);

  const handleShortenUrl = useCallback(async (longUrl: string) => {
    try {
      const res = await shortenUrl(longUrl);
      copyToClipboard(res.shortUrl, 'Short URL');
    } catch {
      showToast('error', 'Failed to shorten URL');
    }
  }, [copyToClipboard, showToast]);

  const handleGenerateQr = useCallback(() => {
    // The GenerateQR component handles the actual API call.
    // We just show the toast here on success.
    showToast('success', 'QR code generated');
  }, [showToast]);

  return (
    <>
      <header className="header" role="banner">
        <div className="container header-inner">
          <a href="/" className="logo" aria-label="Qrify Home">
            <span className="logo-mark" aria-hidden="true">Q</span>
            Qrify
          </a>

          <nav className="nav-tabs" role="tablist" aria-label="Tools">
            <button
              role="tab"
              aria-selected={activeTool === 'shorten'}
              className={`nav-tab ${activeTool === 'shorten' ? 'active' : ''}`}
              onClick={() => setActiveTool('shorten')}
            >
              Shortener
            </button>
            <button
              role="tab"
              aria-selected={activeTool === 'qr'}
              className={`nav-tab ${activeTool === 'qr' ? 'active' : ''}`}
              onClick={() => setActiveTool('qr')}
            >
              QR Generator
            </button>
          </nav>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile tabs */}
        <div className="container mobile-tabs" role="tablist" aria-label="Tools (mobile)">
          <button
            role="tab"
            aria-selected={activeTool === 'shorten'}
            className={`nav-tab mobile-tab ${activeTool === 'shorten' ? 'active' : ''}`}
            onClick={() => setActiveTool('shorten')}
          >
            Shortener
          </button>
          <button
            role="tab"
            aria-selected={activeTool === 'qr'}
            className={`nav-tab mobile-tab ${activeTool === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveTool('qr')}
          >
            QR Generator
          </button>
        </div>
      </header>

      <main className="main" role="main">
        <div className="container">
          <section className="hero" aria-labelledby="hero-title">
            <h1 id="hero-title" className="hero-title">
              {activeTool === 'shorten' ? 'Simplify Your Links' : 'Generate QR Codes'}
            </h1>
            <p className="hero-subtitle">
              {activeTool === 'shorten'
                ? 'Transform long URLs into clean, shareable links instantly.'
                : 'Create beautiful QR codes for any URL. Download and share instantly.'}
            </p>
          </section>

          <div className="tool-panel" role="region" aria-label={activeTool === 'shorten' ? 'URL Shortener' : 'QR Code Generator'}>
            <div className="tool-header">
              <h2 className="tool-title">
                {activeTool === 'shorten' ? 'URL Shortener' : 'QR Code Generator'}
              </h2>
              <p className="tool-description">
                {activeTool === 'shorten'
                  ? 'Enter a long URL to create a short, memorable link.'
                  : 'Enter a URL to generate a scannable QR code.'}
              </p>
            </div>
            <div className="tool-body">
              {activeTool === 'shorten' ? (
                <ShortenUrl onSubmit={handleShortenUrl} />
              ) : (
                <GenerateQR onSubmit={handleGenerateQr} />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="footer-inner">
          <nav className="footer-links" aria-label="Footer links">
            <a href="/about" target="_blank" rel="noopener noreferrer">About</a>
            <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
            <a href="/terms" target="_blank" rel="noopener noreferrer">Terms</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          </nav>
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Qrify. Built with care.
          </p>
        </div>
      </footer>

      {/* Toasts */}
      <div role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`} role="alert">
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;