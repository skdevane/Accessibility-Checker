import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

export function skipNavigation($: CheerioAPI): Issue[] {
  // The first focusable element should be a skip link (href="#...")
  const firstLink = $('a[href]').first();
  const href = firstLink.attr('href') ?? '';
  const isSkipLink = href.startsWith('#') && href.length > 1;

  if (!isSkipLink) {
    return [
      {
        type: 'skip-navigation',
        wcag: 'WCAG 2.4.1',
        severity: 'moderate',
        category: 'page-structure',
        element: '<body>',
        message: 'Page is missing a skip navigation link as the first focusable element.',
      },
    ];
  }
  return [];
}
