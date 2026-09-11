import { useState } from 'react';
import type { Violation, Impact } from '../../types';

interface ViolationListProps {
  violations: Violation[];
  onHighlight: (v: Violation, nodeIndex: number) => void;
  onClear: () => void;
}

const IMPACT_CFG: Record<Impact, { color: string; bg: string; label: string }> = {
  critical: { color: '#ef4444', bg: '#450a0a', label: 'Critical' },
  serious:  { color: '#f97316', bg: '#431407', label: 'Serious' },
  moderate: { color: '#eab308', bg: '#422006', label: 'Moderate' },
  minor:    { color: '#3b82f6', bg: '#1e3a5f', label: 'Minor' },
};

const IMPACT_ORDER: Impact[] = ['critical', 'serious', 'moderate', 'minor'];

function ImpactBadge({ impact }: { impact: Impact }) {
  const cfg = IMPACT_CFG[impact];
  return (
    <span style={{
      fontSize: 9, fontWeight: 700,
      color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.color}50`,
      padding: '2px 6px', borderRadius: 4,
      textTransform: 'uppercase', letterSpacing: '0.05em',
      flexShrink: 0,
    }}>
      {cfg.label}
    </span>
  );
}

function ViolationRow({ violation, onHighlight }: { violation: Violation; onHighlight: (nodeIndex: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = IMPACT_CFG[violation.impact];

  return (
    <div style={{
      borderBottom: '1px solid #1e293b',
    }}>
      {/* Violation header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', textAlign: 'left',
          padding: '10px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 8,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#e2e8f0',
        }}
      >
        <span style={{
          marginTop: 2, color: cfg.color, flexShrink: 0,
          fontSize: 10, transition: 'transform 0.2s',
          display: 'inline-block',
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>▶</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
            <ImpactBadge impact={violation.impact} />
            <code style={{
              fontSize: 10, color: '#a78bfa',
              background: '#2d1d6e', padding: '1px 5px',
              borderRadius: 3, fontFamily: 'JetBrains Mono, monospace',
            }}>
              {violation.id}
            </code>
          </div>
          <p style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.4, fontWeight: 500 }}>
            {violation.help}
          </p>
        </div>
        <span style={{
          fontSize: 10, color: '#475569', flexShrink: 0, fontWeight: 600,
        }}>
          {violation.nodes.length} el{violation.nodes.length !== 1 ? 's' : ''}
        </span>
      </button>

      {/* Expanded elements */}
      {expanded && (
        <div style={{ paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}>
          {violation.nodes.map((node, i) => (
            <div key={i} style={{
              background: '#0f172a',
              border: `1px solid ${cfg.color}30`,
              borderRadius: 6,
              padding: '8px 10px',
              marginBottom: 6,
            }}>
              {/* HTML snippet */}
              <code style={{
                display: 'block',
                fontSize: 10,
                color: '#4ade80',
                fontFamily: 'JetBrains Mono, monospace',
                marginBottom: 6,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {node.html.slice(0, 80)}{node.html.length > 80 ? '…' : ''}
              </code>

              {/* Highlight button */}
              <button
                onClick={() => onHighlight(i)}
                style={{
                  fontSize: 10, fontWeight: 700,
                  color: cfg.color,
                  background: cfg.bg,
                  border: `1px solid ${cfg.color}60`,
                  padding: '3px 10px', borderRadius: 4,
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}
              >
                🎯 Highlight on Page
              </button>
            </div>
          ))}

          {violation.helpUrl && (
            <a
              href={violation.helpUrl}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 10, color: '#818cf8', textDecoration: 'none', display: 'block', marginTop: 4 }}
            >
              📖 Learn more ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function ViolationList({ violations, onHighlight, onClear }: ViolationListProps) {
  const [filter, setFilter] = useState<'all' | Impact>('all');

  const sorted = IMPACT_ORDER.flatMap((impact) =>
    violations.filter((v) => v.impact === impact)
  );

  const filtered = filter === 'all' ? sorted : sorted.filter((v) => v.impact === filter);

  const countByImpact = Object.fromEntries(
    IMPACT_ORDER.map((imp) => [imp, violations.filter((v) => v.impact === imp).length])
  ) as Record<Impact, number>;

  if (violations.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 20px' }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
        <p style={{ color: '#34d399', fontWeight: 700, fontSize: 14 }}>All clear!</p>
        <p style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>No accessibility violations found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter bar */}
      <div style={{
        display: 'flex', gap: 4, padding: '8px 16px 6px',
        borderBottom: '1px solid #1e293b', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
              border: '1px solid',
              cursor: 'pointer',
              borderColor: filter === 'all' ? '#818cf8' : '#334155',
              background: filter === 'all' ? '#2d1d6e' : 'transparent',
              color: filter === 'all' ? '#818cf8' : '#64748b',
            }}
          >
            All ({violations.length})
          </button>
          {IMPACT_ORDER.filter((imp) => countByImpact[imp] > 0).map((imp) => {
            const cfg = IMPACT_CFG[imp];
            return (
              <button
                key={imp}
                onClick={() => setFilter(imp)}
                style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                  border: '1px solid',
                  cursor: 'pointer',
                  borderColor: filter === imp ? cfg.color : '#334155',
                  background: filter === imp ? cfg.bg : 'transparent',
                  color: filter === imp ? cfg.color : '#64748b',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />
                {cfg.label} ({countByImpact[imp]})
              </button>
            );
          })}
        </div>
        <button
          onClick={onClear}
          style={{
            fontSize: 9, color: '#475569', background: 'transparent',
            border: 'none', cursor: 'pointer', fontWeight: 600,
          }}
        >
          Clear ✕
        </button>
      </div>

      {/* List */}
      <div style={{ maxHeight: 340, overflowY: 'auto' }}>
        {filtered.map((v) => (
          <ViolationRow
            key={v.id}
            violation={v}
            onHighlight={(nodeIndex) => onHighlight(v, nodeIndex)}
          />
        ))}
      </div>
    </div>
  );
}
