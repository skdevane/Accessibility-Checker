import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

export function missingFieldsetLegend($: CheerioAPI): Issue[] {
  const issues: Issue[] = [];

  $('fieldset').each((_, el) => {
    if ($(el).find('> legend').length === 0) {
      const raw = $.html(el) ?? '';
      issues.push({
        type: 'missing-fieldset-legend',
        wcag: 'WCAG 1.3.1',
        severity: 'moderate',
        category: 'forms-labels',
        element: raw.slice(0, 120),
        message: '<fieldset> is missing a <legend> child element.',
      });
    }
  });

  return issues;
}
