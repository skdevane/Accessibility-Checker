import * as cheerio from 'cheerio';
import { Issue } from '../types';

// Images & Media
import { missingAlt } from '../rules/images/missingAlt';
import { autoplayMedia } from '../rules/images/autoplayMedia';

// Forms & Labels
import { missingLabel } from '../rules/forms/missingLabel';
import { emptyButton } from '../rules/forms/emptyButton';
import { missingFieldsetLegend } from '../rules/forms/missingFieldsetLegend';

// Page Structure
import { headingStructure } from '../rules/structure/headingStructure';
import { landmarkMain } from '../rules/structure/landmarkMain';
import { skipNavigation } from '../rules/structure/skipNavigation';
import { documentTitle } from '../rules/structure/documentTitle';

// Language
import { htmlLang } from '../rules/language/htmlLang';

// Keyboard & Focus
import { buttonRole } from '../rules/keyboard/buttonRole';
import { positiveTabindex } from '../rules/keyboard/positiveTabindex';
import { ariaHiddenFocus } from '../rules/keyboard/ariaHiddenFocus';

// Links
import { linkText } from '../rules/links/linkText';

// Tables & Frames
import { tableHeaders } from '../rules/tables/tableHeaders';
import { iframeTitle } from '../rules/tables/iframeTitle';

type Rule = ($ : cheerio.CheerioAPI) => Issue[];

const ALL_RULES: Rule[] = [
  missingAlt,
  autoplayMedia,
  missingLabel,
  emptyButton,
  missingFieldsetLegend,
  headingStructure,
  landmarkMain,
  skipNavigation,
  documentTitle,
  htmlLang,
  buttonRole,
  positiveTabindex,
  ariaHiddenFocus,
  linkText,
  tableHeaders,
  iframeTitle,
];

export function runRules(html: string): Issue[] {
  const $ = cheerio.load(html);
  const issues: Issue[] = [];

  for (const rule of ALL_RULES) {
    try {
      const found = rule($);
      issues.push(...found);
    } catch {
      // Individual rule errors should never crash the whole scan
    }
  }

  return issues;
}
