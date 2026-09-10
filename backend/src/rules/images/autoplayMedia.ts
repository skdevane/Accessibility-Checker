import { CheerioAPI } from 'cheerio';
import { Issue } from '../../types';

export function autoplayMedia($: CheerioAPI): Issue[] {
  const issues: Issue[] = [];
  $('video[autoplay], audio[autoplay]').each((_, el) => {
    const hasMuted = $(el).attr('muted') !== undefined;
    const hasControls = $(el).attr('controls') !== undefined;
    if (!hasMuted && !hasControls) {
      const raw = $.html(el) ?? '';
      issues.push({
        type: 'autoplay-media',
        wcag: 'WCAG 1.4.2',
        severity: 'serious',
        category: 'images-media',
        element: raw.slice(0, 120),
        message: 'Media element autoplays without muted or controls attributes.',
      });
    }
  });
  return issues;
}
