import { Router, Request, Response } from 'express';
import { scanWithBrowser } from '../engine/scanWithBrowser';
import { calculateScoreV2 } from '../engine/scoreCalculatorV2';
import { Impact, ScanResult, ScanSummary, Violation } from '../types';

const router = Router();

function isValidUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { url } = req.body as { url?: string };

  if (!url || !isValidUrl(url)) {
    res.status(400).json({ error: 'A valid http/https URL is required.' });
    return;
  }

  try {
    const { axeResults } = await scanWithBrowser(url);

    const violations: Violation[] = axeResults.violations.map((v) => ({
      id: v.id,
      wcag: v.tags.filter((t) => t.startsWith('wcag')),
      impact: (v.impact || 'minor') as Impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map((n) => ({
        html: n.html,
        target: n.target.map((t) => (typeof t === 'string' ? t : JSON.stringify(t))),
        failureSummary: n.failureSummary || '',
      })),
    }));

    const summary: ScanSummary = {
      critical: violations.filter((v) => v.impact === 'critical').length,
      serious: violations.filter((v) => v.impact === 'serious').length,
      moderate: violations.filter((v) => v.impact === 'moderate').length,
      minor: violations.filter((v) => v.impact === 'minor').length,
      passed: axeResults.passes.length,
      inapplicable: axeResults.inapplicable.length,
    };

    const score = calculateScoreV2(summary);

    const result: ScanResult = {
      url,
      score,
      engine: 'v2',
      scannedAt: new Date().toISOString(),
      summary,
      violations,
    };

    res.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      const msg = err.message;

      const isTimeout = msg.includes('timeout') || msg.includes('Timeout') || msg.includes('ETIMEDOUT');
      const isNotFound = msg.includes('ERR_NAME_NOT_RESOLVED') || msg.includes('ENOTFOUND') || msg.includes('EAI_AGAIN');
      const isRefused = msg.includes('ERR_CONNECTION_REFUSED') || msg.includes('ECONNREFUSED');
      const isReset = msg.includes('ERR_CONNECTION_RESET') || msg.includes('ECONNRESET') || msg.includes('EHOSTUNREACH');
      const isSsl = msg.includes('ERR_CERT_') || msg.includes('SSL') || msg.includes('certificate');
      const isHttp404 = msg.includes('404') || msg.includes('ERR_HTTP_RESPONSE_CODE_FAILURE');
      const isHttp5xx = /50[0-9]/.test(msg);

      if (isTimeout) {
        res.status(504).json({ error: 'timeout', message: 'The request timed out. The site may be slow or unresponsive.' });
      } else if (isNotFound) {
        res.status(404).json({ error: 'not_found', message: 'Domain not found. Check the URL for typos.' });
      } else if (isRefused) {
        res.status(502).json({ error: 'refused', message: 'Connection refused. The server at that address is not accepting connections.' });
      } else if (isReset) {
        res.status(502).json({ error: 'unreachable', message: 'The server is unreachable or blocking automated requests.' });
      } else if (isSsl) {
        res.status(502).json({ error: 'ssl', message: 'SSL/TLS error. The site has an invalid or expired certificate.' });
      } else if (isHttp404) {
        res.status(404).json({ error: 'not_found', message: 'Page not found (404). Check the URL is correct.' });
      } else if (isHttp5xx) {
        res.status(502).json({ error: 'server_error', message: 'The target site returned a server error. Try again later.' });
      } else {
        res.status(502).json({ error: 'fetch_failed', message: `Scan failed: ${msg}` });
      }
    } else {
      res.status(500).json({ error: 'unexpected', message: 'An unexpected error occurred. Please try again.' });
    }
  }
});

export default router;
