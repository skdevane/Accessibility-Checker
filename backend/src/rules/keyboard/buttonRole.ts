import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

export function buttonRole($: CheerioAPI): Issue[] {
  const issues: Issue[] = [];

  $('div[onclick], span[onclick]').each((_, el) => {
    const role = $(el).attr('role');
    const tabindex = $(el).attr('tabindex');
    if (role !== 'button' && tabindex === undefined) {
      const raw = $.html(el) ?? '';
      issues.push({
        type: 'missing-button-role',
        wcag: 'WCAG 4.1.2',
        severity: 'moderate',
        category: 'keyboard-focus',
        element: raw.slice(0, 120),
        message: 'Clickable <div>/<span> is missing role="button" and tabindex.',
      });
    }
  });

  return issues;
}
