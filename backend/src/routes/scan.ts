import { Router, Request, Response } from 'express';
import { fetchPage } from '../engine/fetchPage';
import { runRules } from '../engine/runRules';
import { calculateScore } from '../engine/scoreCalculator';
import { ScanResult } from '../types';

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
    const html = await fetchPage(url);
    const issues = runRules(html);
    const score = calculateScore(issues);

    const result: ScanResult = {
      url,
      score,
      issues,
      issueCount: issues.length,
      scannedAt: new Date().toISOString(),
    };

    res.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      const msg = err.message;

      const isTimeout    = msg.includes('timeout') || msg.includes('ECONNABORTED') || msg.includes('ETIMEDOUT');
      const isNotFound   = msg.includes('ENOTFOUND') || msg.includes('EAI_AGAIN');
      const isRefused    = msg.includes('ECONNREFUSED');
      const isReset      = msg.includes('ECONNRESET') || msg.includes('EHOSTUNREACH') || msg.includes('ENETUNREACH');
      const isSsl        = msg.includes('SSL') || msg.includes('certificate') || msg.includes('CERT_');
      const isHttp404    = msg.includes('404');
      const isHttp5xx    = /50[0-9]/.test(msg);

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
        res.status(502).json({ error: 'fetch_failed', message: 'Could not fetch the page. Make sure the URL is publicly accessible.' });
      }
    } else {
      res.status(500).json({ error: 'unexpected', message: 'An unexpected error occurred. Please try again.' });
    }
  }
});

export default router;
