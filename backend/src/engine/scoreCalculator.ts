import { Issue, Severity } from '../types';

const SEVERITY_WEIGHTS: Record<Severity, number> = {
  serious: 10,
  moderate: 5,
  minor: 2,
};

export function calculateScore(issues: Issue[]): number {
  const penalty = issues.reduce(
    (sum, issue) => sum + SEVERITY_WEIGHTS[issue.severity],
    0,
  );
  return Math.max(0, 100 - penalty);
}
