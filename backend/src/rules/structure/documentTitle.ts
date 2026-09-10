import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

export function documentTitle($: CheerioAPI): Issue[] {
  const title = $('title').text().trim();
  if (!title) {
    return [
      {
        type: 'document-title',
        wcag: 'WCAG 2.4.2',
        severity: 'serious',
        category: 'page-structure',
        element: '<head>',
        message: 'Page is missing a <title> element or the title is empty.',
      },
    ];
  }
  return [];
}
