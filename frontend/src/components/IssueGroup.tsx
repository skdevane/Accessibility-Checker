import { useState } from 'react';
import type { Issue, Category } from '../types';
import { IssueRow } from './IssueRow';

interface IssueGroupProps {
  category: Category;
  issues: Issue[];
}

const CATEGORY_LABELS: Record<Category, { label: string; icon: string; accent: string; bg: string; border: string }> = {
  'images-media':   { label: 'Images & Media',   icon: '🖼️', accent: 'text-violet-600', bg: 'bg-violet-50',  border: 'border-violet-200' },
  'forms-labels':   { label: 'Forms & Labels',    icon: '📋', accent: 'text-teal-600',   bg: 'bg-teal-50',    border: 'border-teal-200'   },
  'page-structure': { label: 'Page Structure',    icon: '🏗️', accent: 'text-indigo-600', bg: 'bg-indigo-50',  border: 'border-indigo-200' },
  'language':       { label: 'Language',          icon: '🌐', accent: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-200'   },
  'keyboard-focus': { label: 'Keyboard & Focus',  icon: '⌨️', accent: 'text-fuchsia-600',bg: 'bg-fuchsia-50', border: 'border-fuchsia-200'},
  'links':          { label: 'Links',             icon: '🔗', accent: 'text-pink-600',   bg: 'bg-pink-50',    border: 'border-pink-200'   },
  'tables-frames':  { label: 'Tables & Frames',   icon: '📊', accent: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-200'  },
};

export function IssueGroup({ category, issues }: IssueGroupProps) {
  const [open, setOpen] = useState(true);
  const { label, icon, accent, bg, border } = CATEGORY_LABELS[category];
  const seriousCount = issues.filter((i) => i.severity === 'serious').length;

  return (
    <div className={`bg-white rounded-2xl border-2 ${border} card-shadow overflow-hidden animate-fade-in`}>
      {/* Header button */}
      <button
        id={`group-${category}`}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-5 py-3.5 hover:${bg} transition-colors duration-150 text-left`}
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`text-base leading-none p-2 rounded-xl ${bg}`}>{icon}</span>
          <span className={`font-bold text-sm ${accent}`}>{label}</span>

          {/* Issue count pill */}
          <span className="text-xs bg-purple-100 text-purple-600 font-bold rounded-full px-2.5 py-0.5 border border-purple-200">
            {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
          </span>

          {/* Serious badge */}
          {seriousCount > 0 && (
            <span className="text-xs bg-rose-100 text-rose-600 font-bold border border-rose-300 rounded-full px-2.5 py-0.5">
              🚨 {seriousCount} serious
            </span>
          )}
        </div>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-purple-400 transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Issues list */}
      {open && (
        <div className="px-5 pb-4 border-t border-dashed border-purple-100 animate-slide-down">
          {issues.map((issue, idx) => (
            <IssueRow key={`${issue.type}-${idx}`} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
