import type { ViolationNode } from '../types';

interface ElementDetailProps {
  node: ViolationNode;
  index: number;
}

export function ElementDetail({ node, index }: ElementDetailProps) {
  return (
    <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-slate-200 border border-slate-700 shadow-inner">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
        <span className="font-sans font-semibold text-purple-300">Element #{index + 1}</span>
        {node.target.length > 0 && (
          <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded truncate max-w-[250px]" title={node.target.join(' > ')}>
            {node.target.join(' > ')}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-slate-400 font-sans block text-[11px] uppercase tracking-wider mb-1">HTML Snippet</span>
          <pre className="bg-slate-950 p-2.5 rounded-lg overflow-x-auto text-emerald-400 text-[11px] leading-relaxed border border-slate-800/80">
            <code>{node.html || 'N/A'}</code>
          </pre>
        </div>

        {node.failureSummary && (
          <div>
            <span className="text-slate-400 font-sans block text-[11px] uppercase tracking-wider mb-1">Fix Suggestion</span>
            <p className="bg-amber-950/40 border border-amber-900/50 text-amber-200 p-2.5 rounded-lg font-sans text-xs leading-normal">
              {node.failureSummary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
