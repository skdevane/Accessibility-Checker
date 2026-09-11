export type Impact = 'critical' | 'serious' | 'moderate' | 'minor';

export interface ViolationNode {
  html: string;
  target: string[];
  failureSummary: string;
}

export interface Violation {
  id: string;
  wcag: string[];
  impact: Impact;
  description: string;
  help: string;
  helpUrl: string;
  nodes: ViolationNode[];
}

export interface ScanSummary {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
  passed: number;
}

export interface ScanResult {
  url: string;
  score: number;
  summary: ScanSummary;
  violations: Violation[];
  scannedAt: string;
}

// Extension messages
export type MessageType =
  | 'RUN_AXE'
  | 'AXE_RESULT'
  | 'HIGHLIGHT_ELEMENT'
  | 'CLEAR_HIGHLIGHTS';

export interface RunAxeMessage {
  type: 'RUN_AXE';
}

export interface AxeResultMessage {
  type: 'AXE_RESULT';
  result?: ScanResult;
  error?: string;
}

export interface HighlightElementMessage {
  type: 'HIGHLIGHT_ELEMENT';
  target: string[];
  impact: Impact;
  help: string;
}

export interface ClearHighlightsMessage {
  type: 'CLEAR_HIGHLIGHTS';
}

export type ExtensionMessage =
  | RunAxeMessage
  | AxeResultMessage
  | HighlightElementMessage
  | ClearHighlightsMessage;
