import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

export function iframeTitle($: CheerioAPI): Issue[] {
  const issues: Issue[] = [];

  $('iframe').each((_, el) => {
    const title = $(el).attr('title')?.trim();
    if (!title) {
      const raw = $.html(el) ?? '';
      issues.push({
        type: 'iframe-title',
        wcag: 'WCAG 4.1.2',
        severity: 'serious',
        category: 'tables-frames',
        element: raw.slice(0, 120),
        message: '<iframe> is missing a title attribute.',
      });
    }
  });

  return issues;
}
