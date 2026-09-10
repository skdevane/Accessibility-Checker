import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

export function landmarkMain($: CheerioAPI): Issue[] {
  const hasMain = $('main').length > 0 || $('[role="main"]').length > 0;
  if (!hasMain) {
    return [
      {
        type: 'landmark-no-main',
        wcag: 'WCAG 1.3.6',
        severity: 'moderate',
        category: 'page-structure',
        element: '<body>',
        message: 'Page has no <main> element or role="main" landmark.',
      },
    ];
  }
  return [];
}
