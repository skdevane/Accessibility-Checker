import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

const GENERIC_TEXT = /^(click here|read more|here|link|more|learn more|this|go)$/i;

export function linkText($: CheerioAPI): Issue[] {
  const issues: Issue[] = [];

  $('a').each((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr('aria-label')?.trim();
    const ariaLabelledBy = $(el).attr('aria-labelledby')?.trim();
    const imgAlt = $(el).find('img[alt]').attr('alt')?.trim();

    const accessibleName = ariaLabel || ariaLabelledBy || imgAlt || text;

    if (!accessibleName || GENERIC_TEXT.test(accessibleName)) {
      const raw = $.html(el) ?? '';
      issues.push({
        type: 'link-text',
        wcag: 'WCAG 2.4.4',
        severity: 'moderate',
        category: 'links',
        element: raw.slice(0, 120),
        message: 'Link has empty or non-descriptive accessible name.',
      });
    }
  });

  return issues;
}
