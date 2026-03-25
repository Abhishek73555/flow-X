import { useEffect, useState } from 'react';

export default function App() {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url) {
        try {
          const url = new URL(tabs[0].url);
          setActiveDomain(url.hostname.replace('www.', ''));
        } catch {
          setActiveDomain(null);
        }
      }
    });
  }, []);

  return (
    <div style={{ width: 300, padding: 20, fontFamily: 'sans-serif' }}>
      <h1 style={{ margin: 0, fontSize: 18, color: '#333' }}>Flow-X Telemetry</h1>
      <p style={{ color: '#666', marginTop: 8 }}>
        Currently tracking: <strong>{activeDomain || 'None'}</strong>
      </p>
      <div style={{ marginTop: 16, fontSize: 12, color: '#999' }}>
        Flow-X silently categorizes domains to analyze Deep Work vs Distractions.
      </div>
    </div>
  );
}
