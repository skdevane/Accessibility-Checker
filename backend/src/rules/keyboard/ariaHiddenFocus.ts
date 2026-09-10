import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function ariaHiddenFocus($: CheerioAPI): Issue[] {
  const issues: Issue[] = [];

  $('[aria-hidden="true"]').each((_, container) => {
    $(container).find(FOCUSABLE).each((_, el) => {
      const raw = $.html(el) ?? '';
      issues.push({
        type: 'aria-hidden-focus',
        wcag: 'WCAG 4.1.2',
        severity: 'serious',
        category: 'keyboard-focus',
        element: raw.slice(0, 120),
        message: 'Focusable element is inside an aria-hidden="true" container.',
      });
    });
  });

  return issues;
}
