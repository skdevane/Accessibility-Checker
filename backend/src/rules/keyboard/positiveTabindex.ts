import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

export function positiveTabindex($: CheerioAPI): Issue[] {
  const issues: Issue[] = [];

  $('[tabindex]').each((_, el) => {
    const val = parseInt($(el).attr('tabindex') ?? '0', 10);
    if (val > 0) {
      const raw = $.html(el) ?? '';
      issues.push({
        type: 'positive-tabindex',
        wcag: 'WCAG 2.4.3',
        severity: 'moderate',
        category: 'keyboard-focus',
        element: raw.slice(0, 120),
        message: `Element has tabindex="${val}" which disrupts natural focus order.`,
      });
    }
  });

  return issues;
}
