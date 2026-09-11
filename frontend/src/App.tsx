import { useState } from 'react';
import { ScanForm } from './components/ScanForm';
import { ScoreCard } from './components/ScoreCard';
import { IssueGroup } from './components/IssueGroup';
import { ViolationGroup } from './components/ViolationGroup';
import { ScanProgress } from './components/ScanProgress';
import { ExtensionPage } from './components/ExtensionPage';
import type { ScanResult, Category } from './types';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3002').replace(/\/$/, '');

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
  const [activeTab, setActiveTab] = useState<'scanner' | 'extension'>('scanner');
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

  // V1 grouping compatibility
  const groupedV1 = result?.issues
    ? CATEGORY_ORDER.reduce<Partial<Record<Category, NonNullable<typeof result.issues>>>>(
        (acc, cat) => {
          const items = result.issues!.filter((i) => i.category === cat);
          if (items.length > 0) acc[cat] = items;
          return acc;
        },
        {},
      )
    : {};

  const totalViolations = result?.violations
    ? result.violations.length
    : result?.issueCount ?? 0;

  return (
    <div className="min-h-screen dot-bg">
      {/* ── Skip Navigation Link (WCAG 2.4.1) ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-teal-400 focus:text-white focus:font-bold focus:px-4 focus:py-2 focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        Skip to main content
      </a>

      <div className="max-w-3xl mx-auto px-4 py-12">

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
                ~ Audit any site with Playwright & axe-core ~
              </p>

              {/* Badge row */}
              <div className="flex gap-2 flex-wrap">
                {['axe-core Engine', 'WCAG 2.1 / 2.2', 'Playwright Scanner'].map((tag) => (
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


        {/* ── Accessible Navigation Tab Bar (WCAG 2.4.4 / 4.1.2) ── */}
        <nav aria-label="Main Navigation" className="mb-8">
          <div role="tablist" aria-label="Auditor tool options" className="flex gap-3 bg-purple-100/70 p-1.5 rounded-2xl border-2 border-purple-200">
            <button
              role="tab"
              id="tab-scanner"
              aria-selected={activeTab === 'scanner'}
              aria-controls="panel-scanner"
              onClick={() => setActiveTab('scanner')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                activeTab === 'scanner'
                  ? 'bg-white text-purple-900 card-shadow-sm border-2 border-purple-300'
                  : 'text-purple-600 hover:text-purple-900 hover:bg-white/50'
              }`}
            >
              🌐 Web Auditor
            </button>

            <button
              role="tab"
              id="tab-extension"
              aria-selected={activeTab === 'extension'}
              aria-controls="panel-extension"
              onClick={() => setActiveTab('extension')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                activeTab === 'extension'
                  ? 'bg-white text-purple-900 card-shadow-sm border-2 border-purple-300'
                  : 'text-purple-600 hover:text-purple-900 hover:bg-white/50'
              }`}
            >
              🧩 Chrome Extension
            </button>
          </div>
        </nav>

        {/* ── Main Content Container (role="main" + id for skip link target: WCAG 1.3.6 + 2.4.1) */}
        <main id="main-content" role="main">
          {activeTab === 'scanner' ? (
            <div id="panel-scanner" role="tabpanel" aria-labelledby="tab-scanner" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-purple-200 card-shadow p-6">
                <ScanForm onScan={handleScan} loading={loading} />
              </div>

              {/* ── Multi-Stage Scanning Progress ── */}
              {loading && <ScanProgress />}

              {/* ── Error ── */}
              {error && <ErrorCard error={error} />}

              {/* ── Results ── */}
              {result && (
                <div className="space-y-4 animate-fade-in" aria-live="polite" aria-label="Scan results">
                  <ScoreCard
                    score={result.score}
                    url={result.url}
                    summary={result.summary}
                    issueCount={result.issueCount}
                    scannedAt={result.scannedAt}
                  />

                  {totalViolations === 0 ? (
                    <div className="bg-white rounded-2xl border-2 border-emerald-300 card-shadow text-center py-12 px-6">
                      <div className="text-5xl mb-3">🎉</div>
                      <p className="font-hand text-2xl text-emerald-600 font-bold">All clear!</p>
                      <p className="text-purple-500 text-sm mt-1">
                        {result.summary
                          ? `Passed ${result.summary.passed} WCAG rules with 0 violations!`
                          : 'This page passes all checked accessibility rules.'}
                      </p>
                    </div>
                  ) : result.violations ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-purple-200 card-shadow p-6">
                      <h3 className="font-hand text-xl text-purple-700 font-bold mb-4">
                        ~ Accessibility Violations ({result.violations.length}) ~
                      </h3>
                      <ViolationGroup violations={result.violations} />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="font-hand text-lg text-purple-500 ml-1">
                        ~ Issues by category ~
                      </p>
                      {CATEGORY_ORDER.filter((cat) => groupedV1[cat]).map((cat) => (
                        <IssueGroup key={cat} category={cat} issues={groupedV1[cat]!} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div id="panel-extension" role="tabpanel" aria-labelledby="tab-extension">
              <ExtensionPage />
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
