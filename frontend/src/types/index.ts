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

export type Impact = 'critical' | 'serious' | 'moderate' | 'minor';

export interface ViolationNode {
  html: string;           // The offending element's outer HTML
  target: string[];       // CSS selectors pointing to the element
  failureSummary: string; // "Fix any of the following: ..."
}

export interface Violation {
  id: string;             // axe rule id e.g. 'image-alt'
  wcag: string[];         // e.g. ['wcag111', 'wcag1411']
  impact: Impact;
  description: string;
  help: string;           // Short fix description
  helpUrl: string;        // Link to axe docs
  nodes: ViolationNode[]; // Affected elements
}

export interface ScanSummary {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
  passed: number;         // Number of passing rules
  inapplicable: number;
}

export interface ScanResult {
  url: string;
  score: number;
  engine?: 'v1' | 'v2';
  scannedAt: string;
  summary?: ScanSummary;
  violations?: Violation[];
  // V1 compat
  issues?: Issue[];
  issueCount?: number;
}
