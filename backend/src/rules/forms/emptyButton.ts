import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

export function emptyButton($: CheerioAPI): Issue[] {
  const issues: Issue[] = [];

  $('button').each((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr('aria-label')?.trim();
    const ariaLabelledBy = $(el).attr('aria-labelledby')?.trim();
    const hasImg = $(el).find('img[alt]').length > 0;

    if (!text && !ariaLabel && !ariaLabelledBy && !hasImg) {
      const raw = $.html(el) ?? '';
      issues.push({
        type: 'empty-button',
        wcag: 'WCAG 4.1.2',
        severity: 'serious',
        category: 'forms-labels',
        element: raw.slice(0, 120),
        message: 'Button has no accessible name (no text, aria-label, or aria-labelledby).',
      });
    }
  });

  return issues;
}
