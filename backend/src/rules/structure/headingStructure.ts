import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

export function headingStructure($: CheerioAPI): Issue[] {
  const issues: Issue[] = [];
  const headings = $('h1, h2, h3, h4, h5, h6').toArray();

  // Check for missing or multiple h1
  const h1s = $('h1').toArray();
  if (h1s.length === 0) {
    issues.push({
      type: 'heading-no-h1',
      wcag: 'WCAG 1.3.1',
      severity: 'moderate',
      category: 'page-structure',
      element: '<body>',
      message: 'Page has no <h1> element.',
    });
  } else if (h1s.length > 1) {
    h1s.slice(1).forEach((el) => {
      const raw = $.html(el) ?? '';
      issues.push({
        type: 'heading-multiple-h1',
        wcag: 'WCAG 1.3.1',
        severity: 'moderate',
        category: 'page-structure',
        element: raw.slice(0, 120),
        message: 'Page has more than one <h1> element.',
      });
    });
  }

  // Check for skipped heading levels
  const levelOf = (el: ReturnType<typeof $>[0]) =>
    parseInt($(el).prop('tagName')!.slice(1), 10);

  for (let i = 1; i < headings.length; i++) {
    const prev = levelOf(headings[i - 1]);
    const curr = levelOf(headings[i]);
    if (curr > prev + 1) {
      const raw = $.html(headings[i]) ?? '';
      issues.push({
        type: 'heading-skip',
        wcag: 'WCAG 1.3.1',
        severity: 'moderate',
        category: 'page-structure',
        element: raw.slice(0, 120),
        message: `Heading level skipped from h${prev} to h${curr}.`,
      });
    }
  }

  return issues;
}
