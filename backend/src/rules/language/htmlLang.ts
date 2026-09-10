import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

export function htmlLang($: CheerioAPI): Issue[] {
  const lang = $('html').attr('lang');
  if (!lang) {
    return [
      {
        type: 'html-missing-lang',
        wcag: 'WCAG 3.1.1',
        severity: 'serious',
        category: 'language',
        element: '<html>',
        message: '<html> element is missing the lang attribute.',
      },
    ];
  }
  return [];
}
