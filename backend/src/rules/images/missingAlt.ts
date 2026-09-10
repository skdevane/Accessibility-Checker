import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

export function missingAlt($: CheerioAPI): Issue[] {
  const issues: Issue[] = [];
  $('img').each((_, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined) {
      const raw = $.html(el) ?? '';
      issues.push({
        type: 'missing-alt',
        wcag: 'WCAG 1.1.1',
        severity: 'serious',
        category: 'images-media',
        element: raw.slice(0, 120),
        message: '<img> element is missing an alt attribute.',
      });
    }
  });
  return issues;
}
