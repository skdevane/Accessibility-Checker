import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

export function tableHeaders($: CheerioAPI): Issue[] {
  const issues: Issue[] = [];

  $('table').each((_, el) => {
    const role = $(el).attr('role');
    // Skip layout tables
    if (role === 'presentation' || role === 'none') return;

    const hasDataRows = $(el).find('tr').length > 1;
    const hasTh = $(el).find('th').length > 0;

    if (hasDataRows && !hasTh) {
      const raw = $.html(el) ?? '';
      issues.push({
        type: 'table-headers',
        wcag: 'WCAG 1.3.1',
        severity: 'serious',
        category: 'tables-frames',
        element: raw.slice(0, 120),
        message: 'Data table has no <th> header elements.',
      });
    }
  });

  return issues;
}
