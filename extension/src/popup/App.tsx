import { useState, useCallback } from 'react';
import type { ScanResult, Violation } from '../types';
import { ScoreRing } from './components/ScoreRing';
import { ViolationList } from './components/ViolationList';

type AppState = 'idle' | 'scanning' | 'done' | 'error';

const SCAN_STEPS = [
  { icon: '🔬', label: 'Injecting axe-core...' },
  { icon: '⚡', label: 'Evaluating DOM rules...' },
  { icon: '📊', label: 'Generating report...' },
];

export default function App() {
  const [state, setState] = useState<AppState>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string>('');
  const [scanStep, setScanStep] = useState(0);

  const handleScan = useCallback(async () => {
    setState('scanning');
    setScanStep(0);
    setResult(null);
    setError('');

    // Progress through scan steps visually
    const stepInterval = setInterval(() => {
      setScanStep((prev) => Math.min(prev + 1, SCAN_STEPS.length - 1));
    }, 600);

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error('No active tab found.');

      const response = await chrome.tabs.sendMessage(tab.id, { type: 'RUN_AXE' });

      clearInterval(stepInterval);

      if (response?.error) {
        throw new Error(response.error);
      }
      if (response?.result) {
        setResult(response.result as ScanResult);
        setState('done');
      } else {
        throw new Error('No result received from content script.');
      }
    } catch (err) {
      clearInterval(stepInterval);
      setError(err instanceof Error ? err.message : String(err));
      setState('error');
    }
  }, []);

  const handleHighlight = useCallback(async (violation: Violation, nodeIndex: number) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    const node = violation.nodes[nodeIndex];
    if (!node) return;

    await chrome.tabs.sendMessage(tab.id, {
      type: 'HIGHLIGHT_ELEMENT',
      target: node.target,
      impact: violation.impact,
      help: violation.help,
    });
  }, []);

  const handleClear = useCallback(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    await chrome.tabs.sendMessage(tab.id, { type: 'CLEAR_HIGHLIGHTS' });
  }, []);

  // ── Render states ──

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#0f0f17', minHeight: 200 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        borderBottom: '1px solid #1e293b',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>♿</span>
          <div>
            <h1 style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0', lineHeight: 1 }}>
              Accessibility Auditor
            </h1>
            <p style={{ fontSize: 9, color: '#64748b', fontWeight: 500, marginTop: 2 }}>
              axe-core · WCAG 2.1 / 2.2
            </p>
          </div>
        </div>
        {state === 'done' && result && (
          <button
            onClick={handleScan}
            title="Re-scan"
            style={{
              fontSize: 9, fontWeight: 700, color: '#818cf8',
              background: '#1e1b4b', border: '1px solid #3730a3',
              padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
            }}
          >
            🔄 Re-scan
          </button>
        )}
      </div>

      {/* IDLE */}
      {state === 'idle' && (
        <div style={{ padding: '32px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 20, lineHeight: 1.5 }}>
            Scan the active tab for<br />WCAG accessibility violations
          </p>
          <button
            id="scan-btn"
            onClick={handleScan}
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white',
              fontWeight: 700,
              fontSize: 13,
              padding: '10px 28px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px #7c3aed40',
              transition: 'all 0.2s',
              letterSpacing: '0.03em',
            }}
          >
            ⚡ Scan This Page
          </button>
        </div>
      )}

      {/* SCANNING */}
      {state === 'scanning' && (
        <div style={{ padding: '28px 20px', textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40,
            border: '3px solid #1e293b',
            borderTopColor: '#818cf8',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#818cf8', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
            {SCAN_STEPS[scanStep]?.icon} {SCAN_STEPS[scanStep]?.label}
          </p>
          <p style={{ color: '#475569', fontSize: 10 }}>Running axe-core on active tab…</p>

          {/* Mini step indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
            {SCAN_STEPS.map((_, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i <= scanStep ? '#818cf8' : '#1e293b',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ERROR */}
      {state === 'error' && (
        <div style={{ padding: '20px 16px' }}>
          <div style={{
            background: '#450a0a', border: '1px solid #ef4444',
            borderRadius: 8, padding: '12px 14px',
          }}>
            <p style={{ color: '#fca5a5', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
              ⚠ Scan Failed
            </p>
            <p style={{ color: '#f87171', fontSize: 11, lineHeight: 1.4 }}>{error}</p>
            {error.includes('Could not establish connection') && (
              <p style={{ color: '#6b7280', fontSize: 10, marginTop: 8, lineHeight: 1.4 }}>
                Tip: Refresh the page and try again. Content scripts can't run on chrome:// pages.
              </p>
            )}
          </div>
          <button
            onClick={() => setState('idle')}
            style={{
              marginTop: 12, width: '100%',
              background: '#1e293b', color: '#94a3b8',
              border: '1px solid #334155',
              padding: '8px', borderRadius: 8,
              cursor: 'pointer', fontSize: 12, fontWeight: 600,
            }}
          >
            ← Try Again
          </button>
        </div>
      )}

      {/* DONE */}
      {state === 'done' && result && (
        <div className="animate-fade-in">
          <ScoreRing score={result.score} summary={result.summary} />

          <div style={{ borderTop: '1px solid #1e293b' }}>
            <div style={{
              padding: '6px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                Violations ({result.violations.length})
              </p>
              <p style={{ fontSize: 9, color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>
                {new URL(result.url).hostname}
              </p>
            </div>
            <ViolationList
              violations={result.violations}
              onHighlight={handleHighlight}
              onClear={handleClear}
            />
          </div>
        </div>
      )}
    </div>
  );
}
