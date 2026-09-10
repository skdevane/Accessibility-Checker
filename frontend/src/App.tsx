import { useState } from 'react';
import { ScanForm } from './components/ScanForm';
import { ScoreCard } from './components/ScoreCard';
import { IssueGroup } from './components/IssueGroup';
import type { ScanResult, Category } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const CATEGORY_ORDER: Category[] = [
  'images-media',
  'forms-labels',
  'page-structure',
  'language',
  'keyboard-focus',
  'links',
  'tables-frames',
];

/** Logo image */
function LaptopIllustration() {
  return (
    <img
      src="/logo.png"
      alt="Accessibility Checker logo"
      className="w-24 h-24 object-contain drop-shadow-md"
    />
  );
}

// ── Error types ──────────────────────────────────────────────────────────────
type ErrorCode =
  | 'timeout' | 'not_found' | 'refused' | 'unreachable'
  | 'ssl' | 'server_error' | 'fetch_failed' | 'unexpected' | 'network';

interface AppError { code: ErrorCode; message: string; }

const ERROR_META: Record<ErrorCode, { icon: string; title: string; hint: string }> = {
  timeout:      { icon: '⏱️', title: 'Request Timed Out',        hint: 'The site took too long to respond. Try again or check if it\'s online.' },
  not_found:    { icon: '🔍', title: 'Page Not Found',           hint: 'Double-check the URL for typos and make sure the page exists.' },
  refused:      { icon: '🚫', title: 'Connection Refused',       hint: 'The server rejected the connection. It may be localhost or behind a firewall.' },
  unreachable:  { icon: '📡', title: 'Server Unreachable',       hint: 'The site appears to be offline or is blocking automated requests.' },
  ssl:          { icon: '🔒', title: 'SSL Certificate Error',    hint: 'The site has an invalid or expired HTTPS certificate.' },
  server_error: { icon: '💥', title: 'Site Returned an Error',   hint: 'The target server responded with an error (5xx). Try again later.' },
  fetch_failed: { icon: '🌐', title: 'Could Not Fetch Page',     hint: 'Make sure the URL is publicly accessible and not behind a login.' },
  unexpected:   { icon: '⚠️', title: 'Unexpected Error',         hint: 'Something went wrong on our end. Please try again.' },
  network:      { icon: '🔌', title: 'Cannot Reach Scanner',     hint: 'The scanner backend is not running. Start it with `npm run dev` in /backend.' },
};

function ErrorCard({ error }: { error: AppError }) {
  const { icon, title, hint } = ERROR_META[error.code];
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 card-shadow-sm mb-6 animate-fade-in"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl shrink-0 mt-0.5" aria-hidden="true">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-rose-700 text-base">{title}</p>
          <p className="text-rose-600 text-sm mt-0.5">{error.message}</p>
          <p className="text-rose-400 text-xs mt-2 italic">{hint}</p>
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  async function handleScan(url: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json() as ScanResult & { error?: ErrorCode; message?: string };

      if (!res.ok) {
        setError({
          code: data.error ?? 'unexpected',
          message: data.message ?? 'Something went wrong.',
        });
        return;
      }

      setResult(data);
    } catch {
      setError({ code: 'network', message: 'Could not reach the scanner backend.' });
    } finally {
      setLoading(false);
    }
  }

  // Group issues by category
  const grouped = result
    ? CATEGORY_ORDER.reduce<Partial<Record<Category, typeof result.issues>>>(
        (acc, cat) => {
          const items = result.issues.filter((i) => i.category === cat);
          if (items.length > 0) acc[cat] = items;
          return acc;
        },
        {},
      )
    : {};

  return (
    <div className="min-h-screen dot-bg">
      {/* ── Skip Navigation Link (WCAG 2.4.1) ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-teal-400 focus:text-white focus:font-bold focus:px-4 focus:py-2 focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        Skip to main content
      </a>

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* ── Hero Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-6">
            {/* Laptop doodle — left */}
            <div className="shrink-0">
              <LaptopIllustration />
            </div>

            {/* Title + subtitle + badges — right */}
            <div>
              {/* Title — h1 for WCAG 1.3.1 */}
              <h1
                className="inline-block bg-teal-400 text-white font-hand text-xl font-bold px-5 py-1.5 rounded-xl mb-3 rotate-[-1deg]"
                style={{ boxShadow: '3px 3px 0 #0d9488' }}
              >
                Accessibility Checker
              </h1>

              {/* Subtitle */}
              <p className="font-hand text-lg text-purple-500 mb-3">
                ~ Audit any site for WCAG 2.1 AA issues ~
              </p>

              {/* Badge row */}
              <div className="flex gap-2 flex-wrap">
                {['WCAG 2.1 AA', '15 Rules', 'Instant Scan'].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-bold bg-white border-2 border-purple-200 text-purple-500 px-3 py-1 rounded-full card-shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>


        {/* ── Scan Form Card ── (role="main" + id for skip link target: WCAG 1.3.6 + 2.4.1) */}
        <main id="main-content" role="main">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-purple-200 card-shadow p-6 mb-6">
            <ScanForm onScan={handleScan} loading={loading} />
          </div>

          {/* ── Error ── */}
          {error && <ErrorCard error={error} />}

          {/* ── Results ── */}
          {result && (
            <div className="space-y-4 animate-fade-in" aria-live="polite" aria-label="Scan results">
              <ScoreCard
                score={result.score}
                url={result.url}
                issueCount={result.issueCount}
                scannedAt={result.scannedAt}
              />

              {result.issueCount === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-emerald-300 card-shadow text-center py-12 px-6">
                  <div className="text-5xl mb-3">🎉</div>
                  <p className="font-hand text-2xl text-emerald-600 font-bold">All clear!</p>
                  <p className="text-purple-400 text-sm mt-1">This page passes all 15 checked rules.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-hand text-lg text-purple-500 ml-1">
                    ~ Issues by category ~
                  </p>
                  {CATEGORY_ORDER.filter((cat) => grouped[cat]).map((cat) => (
                    <IssueGroup key={cat} category={cat} issues={grouped[cat]!} />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>


      </div>
    </div>
  );
}
