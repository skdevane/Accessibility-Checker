import { useState } from 'react';
import type { Impact, Violation } from '../types';
import { ElementDetail } from './ElementDetail';

interface ViolationGroupProps {
  violations: Violation[];
}

const impactConfig: Record<Impact, { label: string; badgeBg: string; badgeText: string; borderColor: string; dotColor: string }> = {
  critical: {
    label: 'Critical',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800 border-rose-300',
    borderColor: 'border-rose-200',
    dotColor: 'bg-rose-600',
  },
  serious: {
    label: 'Serious',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-800 border-orange-300',
    borderColor: 'border-orange-200',
    dotColor: 'bg-orange-500',
  },
  moderate: {
    label: 'Moderate',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800 border-amber-300',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
  },
  minor: {
    label: 'Minor',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800 border-blue-300',
    borderColor: 'border-blue-200',
    dotColor: 'bg-blue-500',
  },
};

function ViolationRow({ violation }: { violation: Violation }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = impactConfig[violation.impact] || impactConfig.minor;

  return (
    <div className={`bg-white rounded-xl border ${cfg.borderColor} p-4 mb-3 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.badgeBg} ${cfg.badgeText}`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dotColor}`}></span>
            {cfg.label}
          </span>
          <code className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            {violation.id}
          </code>
          {violation.wcag.map((tag) => (
            <span key={tag} className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase">
              {tag.replace('wcag', 'WCAG ')}
            </span>
          ))}
        </div>

        {violation.helpUrl && (
          <a
            href={violation.helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-purple-600 hover:text-purple-800 hover:underline inline-flex items-center gap-1 shrink-0"
          >
            Learn more ↗
          </a>
        )}
      </div>

      <h4 className="font-bold text-slate-800 text-sm mb-1">{violation.help}</h4>
      <p className="text-slate-600 text-xs leading-relaxed mb-3">{violation.description}</p>

      {violation.nodes.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors inline-flex items-center gap-1.5"
          >
            <span>{expanded ? 'Hide affected elements ▲' : `Show affected elements (${violation.nodes.length}) ▼`}</span>
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 pl-1 border-l-2 border-purple-200">
              {violation.nodes.map((node, idx) => (
                <ElementDetail key={idx} node={node} index={idx} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ViolationGroup({ violations }: ViolationGroupProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | Impact>('all');

  const filteredViolations = violations.filter((v) => {
    if (selectedFilter === 'all') return true;
    return v.impact === selectedFilter;
  });

  const countByImpact = {
    critical: violations.filter((v) => v.impact === 'critical').length,
    serious: violations.filter((v) => v.impact === 'serious').length,
    moderate: violations.filter((v) => v.impact === 'moderate').length,
    minor: violations.filter((v) => v.impact === 'minor').length,
  };

  return (
    <div className="space-y-4">
      {/* Impact Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-purple-100 pb-3">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            selectedFilter === 'all'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
          }`}
        >
          All ({violations.length})
        </button>

        {(['critical', 'serious', 'moderate', 'minor'] as Impact[]).map((impact) => {
          const count = countByImpact[impact];
          if (count === 0) return null;
          const cfg = impactConfig[impact];
          return (
            <button
              key={impact}
              onClick={() => setSelectedFilter(impact)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 ${
                selectedFilter === impact
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${cfg.dotColor}`}></span>
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Violation Cards */}
      {filteredViolations.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center">
          <p className="font-bold text-base mb-1">🎉 No violations in this filter category!</p>
          <p className="text-xs text-emerald-600">Selected filter yielded zero accessibility issues.</p>
        </div>
      ) : (
        <div>
          {filteredViolations.map((v) => (
            <ViolationRow key={v.id} violation={v} />
          ))}
        </div>
      )}
    </div>
  );
}
