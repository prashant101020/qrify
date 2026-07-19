const getApiBaseUrl = () => {
  // In development with Vite proxy, use relative URLs
  if (import.meta.env.DEV) {
    return '';
  }
  // In production, use same origin
  return '';
};

const API_BASE_URL = getApiBaseUrl();

interface ShortenUrlResponse {
  shortUrl: string;
  shortKey: string;
  longUrl: string;
}

export const shortenUrl = async (longUrl: string): Promise<ShortenUrlResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ longUrl }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to shorten URL');
  }

  return response.json();
};

export const generateQrCode = async (url: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/qrcode?url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new Error('Failed to generate QR code');
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};