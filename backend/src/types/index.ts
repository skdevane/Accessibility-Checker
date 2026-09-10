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
  type: string;        // e.g. 'missing-alt'
  wcag: string;        // e.g. 'WCAG 1.1.1'
  severity: Severity;
  category: Category;
  element: string;     // outerHTML snippet trimmed to 120 chars
  message: string;     // human-readable description
}

export interface ScanResult {
  url: string;
  score: number;       // 0–100
  issues: Issue[];
  issueCount: number;
  scannedAt: string;   // ISO timestamp
}
