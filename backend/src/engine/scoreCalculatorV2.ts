import { Impact, ScanSummary } from '../types';

export function calculateScoreV2(summary: ScanSummary): number {
  const penalty =
    summary.critical * 15 +
    summary.serious * 10 +
    summary.moderate * 5 +
    summary.minor * 2;

  return Math.max(0, 100 - penalty);
}
