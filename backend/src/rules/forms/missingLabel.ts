import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

const FORM_CONTROLS = 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]), select, textarea';

export function missingLabel($: CheerioAPI): Issue[] {
  const issues: Issue[] = [];

  $(FORM_CONTROLS).each((_, el) => {
    const id = $(el).attr('id');
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledBy = $(el).attr('aria-labelledby');

    const hasLabel = id ? $(`label[for="${id}"]`).length > 0 : false;

    if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
      const raw = $.html(el) ?? '';
      issues.push({
        type: 'missing-label',
        wcag: 'WCAG 1.3.1',
        severity: 'serious',
        category: 'forms-labels',
        element: raw.slice(0, 120),
        message: 'Form control has no associated label.',
      });
    }
  });

  return issues;
}
