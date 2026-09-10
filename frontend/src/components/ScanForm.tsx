import { useState, type FormEvent } from 'react';

interface ScanFormProps {
  onScan: (url: string) => void;
  loading: boolean;
}

export function ScanForm({ onScan, loading }: ScanFormProps) {
  const [url, setUrl] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    onScan(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Label above */}
      <p className="font-hand text-xl text-purple-500 mb-2 ml-1">~ Enter a URL to check ~</p>

      {/* Card wrapper */}
      <div className="bg-white rounded-2xl border-2 border-purple-200 card-shadow p-4 flex flex-col sm:flex-row gap-3">
        <input
          id="url-input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-purple-50 border-2 border-dashed border-purple-200 text-purple-900 placeholder-purple-300 font-medium focus:outline-none focus:border-teal-400 focus:bg-teal-50/30 transition-all duration-200 disabled:opacity-50 text-sm"
        />
        <button
          id="scan-button"
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-teal-400 hover:bg-teal-500 text-white border-2 border-teal-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
          style={{ boxShadow: '0 3px 0 #0d9488' }}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Scanning…
            </>
          ) : (
            <>
              <span>🔍</span> Scan
            </>
          )}
        </button>
      </div>
    </form>
  );
}
