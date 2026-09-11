import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import type { AxeResults } from 'axe-core';

export interface ScanWithBrowserResult {
  html: string;
  axeResults: AxeResults;
}

export async function scanWithBrowser(url: string): Promise<ScanWithBrowserResult> {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();

    // 1. Navigate to target URL - try networkidle with fallback to domcontentloaded
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 25_000 });
    } catch {
      // Fallback if site streams connections or long-polls
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15_000 }).catch(() => {});
    }

    // 2. Wait for web fonts to finish loading (accurate color contrast)
    await page.evaluate('document.fonts ? document.fonts.ready : Promise.resolve()').catch(() => {});

    // 3. Brief layout stabilization pause (allows popups & dynamic widgets to settle)
    await page.waitForTimeout(1500);

    // 4. Run axe-core accessibility analysis
    const axeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();

    const html = await page.content();

    return { html, axeResults };
  } finally {
    await browser.close();
  }
}

