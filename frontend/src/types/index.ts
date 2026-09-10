export type Severity = 'serious' | 'moderate' | 'minor';

export type Category =
  | 'images-media'
  | 'forms-labels'
  | 'page-structure'
  | 'language'
  | 'keyboard-focus'
  | 'links'
  | 'tables-frames';

export interface Issue {
  type: string;
  wcag: string;
  severity: Severity;
  category: Category;
  element: string;
  message: string;
}

export interface ScanResult {
  url: string;
  score: number;
  issues: Issue[];
  issueCount: number;
  scannedAt: string;
}
