import axe from 'axe-core';
import type {
  ExtensionMessage,
  ScanResult,
  Violation,
  ViolationNode,
  Impact,
  ScanSummary,
} from '../types';

// ── Highlight Overlay ───────────────────────────────────────────────────────

const HIGHLIGHT_CLASS = 'a11y-auditor-highlight';
const TOOLTIP_CLASS = 'a11y-auditor-tooltip';
const OVERLAY_ID = 'a11y-auditor-overlay-style';

const IMPACT_COLORS: Record<Impact, { border: string; bg: string; text: string }> = {
  critical: { border: '#ef4444', bg: '#fef2f2', text: '#991b1b' },
  serious:  { border: '#f97316', bg: '#fff7ed', text: '#9a3412' },
  moderate: { border: '#eab308', bg: '#fefce8', text: '#854d0e' },
  minor:    { border: '#3b82f6', bg: '#eff6ff', text: '#1e40af' },
};

function injectStyles() {
  if (document.getElementById(OVERLAY_ID)) return;
  const style = document.createElement('style');
  style.id = OVERLAY_ID;
  style.textContent = `
    .${HIGHLIGHT_CLASS} {
      outline: 3px solid var(--a11y-border) !important;
      outline-offset: 2px !important;
      background-color: var(--a11y-bg) !important;
      position: relative !important;
      z-index: 2147483640 !important;
      transition: outline 0.2s ease;
    }
    .${TOOLTIP_CLASS} {
      position: absolute !important;
      top: -36px !important;
      left: 0 !important;
      background: var(--a11y-border) !important;
      color: white !important;
      font-size: 11px !important;
      font-family: monospace !important;
      font-weight: bold !important;
      padding: 3px 8px !important;
      border-radius: 4px !important;
      white-space: nowrap !important;
      z-index: 2147483647 !important;
      pointer-events: none !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
    }
    .${TOOLTIP_CLASS}::after {
      content: '' !important;
      position: absolute !important;
      top: 100% !important;
      left: 8px !important;
      border: 4px solid transparent !important;
      border-top-color: var(--a11y-border) !important;
    }
  `;
  document.head.appendChild(style);
}

function clearHighlights() {
  document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((el) => {
    el.classList.remove(HIGHLIGHT_CLASS);
    (el as HTMLElement).style.removeProperty('--a11y-border');
    (el as HTMLElement).style.removeProperty('--a11y-bg');
  });
  document.querySelectorAll(`.${TOOLTIP_CLASS}`).forEach((el) => el.remove());
}

function highlightElement(targets: string[], impact: Impact, help: string) {
  injectStyles();
  clearHighlights();

  const colors = IMPACT_COLORS[impact] || IMPACT_COLORS.minor;

  for (const selector of targets) {
    let el: Element | null = null;
    try {
      el = document.querySelector(selector);
    } catch {
      continue;
    }
    if (!el) continue;

    const htmlEl = el as HTMLElement;
    htmlEl.style.setProperty('--a11y-border', colors.border);
    htmlEl.style.setProperty('--a11y-bg', colors.bg);
    htmlEl.classList.add(HIGHLIGHT_CLASS);

    // Add tooltip badge
    const tooltip = document.createElement('span');
    tooltip.className = TOOLTIP_CLASS;
    tooltip.textContent = `⚠ ${help}`;
    tooltip.style.setProperty('--a11y-border', colors.border);

    // Only add tooltip if element is positioned (otherwise it may not show correctly)
    const pos = getComputedStyle(htmlEl).position;
    if (pos === 'static') htmlEl.style.position = 'relative';
    htmlEl.appendChild(tooltip);

    // Scroll into view
    htmlEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    break; // highlight first matching element
  }
}

// ── Scoring ─────────────────────────────────────────────────────────────────

function calculateScore(summary: ScanSummary): number {
  const penalty =
    summary.critical * 15 +
    summary.serious * 10 +
    summary.moderate * 5 +
    summary.minor * 2;
  return Math.max(0, 100 - penalty);
}

// ── axe-core Runner ─────────────────────────────────────────────────────────

async function runAxe(): Promise<ScanResult> {
  const results = await axe.run(document, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
    },
  });

  const violations: Violation[] = results.violations.map((v) => ({
    id: v.id,
    wcag: v.tags.filter((t: string) => t.startsWith('wcag')),
    impact: (v.impact || 'minor') as Impact,
    description: v.description,
    help: v.help,
    helpUrl: v.helpUrl,
    nodes: v.nodes.map((n: axe.NodeResult) => ({
      html: n.html,
      target: n.target.map((t) => (typeof t === 'string' ? t : JSON.stringify(t))),
      failureSummary: n.failureSummary || '',
    })) as ViolationNode[],
  }));

  const summary: ScanSummary = {
    critical: violations.filter((v) => v.impact === 'critical').length,
    serious: violations.filter((v) => v.impact === 'serious').length,
    moderate: violations.filter((v) => v.impact === 'moderate').length,
    minor: violations.filter((v) => v.impact === 'minor').length,
    passed: results.passes.length,
  };

  return {
    url: window.location.href,
    score: calculateScore(summary),
    summary,
    violations,
    scannedAt: new Date().toISOString(),
  };
}

// ── Message Listener ────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(
  (msg: ExtensionMessage, _sender, sendResponse) => {
    if (msg.type === 'RUN_AXE') {
      runAxe()
        .then((result) => sendResponse({ type: 'AXE_RESULT', result }))
        .catch((err) =>
          sendResponse({ type: 'AXE_RESULT', error: String(err) })
        );
      return true; // keep message channel open for async
    }

    if (msg.type === 'HIGHLIGHT_ELEMENT') {
      highlightElement(msg.target, msg.impact, msg.help);
      sendResponse({ ok: true });
    }

    if (msg.type === 'CLEAR_HIGHLIGHTS') {
      clearHighlights();
      sendResponse({ ok: true });
    }
  }
);
