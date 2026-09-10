import type { Issue, Severity } from '../types';

interface IssueRowProps {
  issue: Issue;
}

const SEVERITY_STYLES: Record<Severity, { badge: string; dot: string; label: string }> = {
  serious: {
    badge: 'bg-rose-100 text-rose-600 border-rose-300',
    dot: 'bg-rose-400',
    label: 'Serious',
  },
  moderate: {
    badge: 'bg-amber-100 text-amber-700 border-amber-300',
    dot: 'bg-amber-400',
    label: 'Moderate',
  },
  minor: {
    badge: 'bg-sky-100 text-sky-600 border-sky-300',
    dot: 'bg-sky-400',
    label: 'Minor',
  },
};

export function IssueRow({ issue }: IssueRowProps) {
  const { badge, dot, label } = SEVERITY_STYLES[issue.severity];

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 py-3 border-b border-dashed border-purple-100 last:border-0">
      {/* Left badges */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
          {label}
        </span>
        <span className="text-xs text-purple-400 font-semibold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
          {issue.wcag}
        </span>
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className="text-purple-800 text-sm font-medium leading-snug">{issue.message}</p>
        {issue.element && issue.element !== '<body>' && issue.element !== '<head>' && issue.element !== '<html>' && (
          <code className="mt-1.5 block text-xs text-purple-500 bg-purple-50 border border-dashed border-purple-200 rounded-lg px-3 py-1.5 truncate font-mono">
            {issue.element}
          </code>
        )}
      </div>
    </div>
  );
}
