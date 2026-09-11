import type { ScanSummary } from '../../types';

interface ScoreRingProps {
  score: number;
  summary: ScanSummary;
}

function scoreBand(score: number) {
  if (score >= 80) return { color: '#34d399', label: 'Great', emoji: '🎉' };
  if (score >= 50) return { color: '#fbbf24', label: 'Needs Work', emoji: '🔧' };
  return { color: '#f87171', label: 'Critical', emoji: '🚨' };
}

export function ScoreRing({ score, summary }: ScoreRingProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { color, label, emoji } = scoreBand(score);

  const impacts = [
    { key: 'critical', label: 'Critical', color: '#ef4444', count: summary.critical },
    { key: 'serious',  label: 'Serious',  color: '#f97316', count: summary.serious },
    { key: 'moderate', label: 'Moderate', color: '#eab308', count: summary.moderate },
    { key: 'minor',    label: 'Minor',    color: '#3b82f6', count: summary.minor },
    { key: 'passed',   label: 'Passed',   color: '#22c55e', count: summary.passed },
  ];

  return (
    <div style={{ padding: '20px 20px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Score Ring */}
        <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out', filter: `drop-shadow(0 0 8px ${color}60)` }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 26, fontWeight: 900, color, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {emoji} {label}
            </span>
          </div>
        </div>

        {/* Impact grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {impacts.map((imp) => (
            <div key={imp.key} style={{
              background: '#1a1a2e',
              border: `1px solid ${imp.color}30`,
              borderRadius: 8,
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: imp.color,
                flexShrink: 0,
                boxShadow: `0 0 6px ${imp.color}80`,
              }} />
              <div>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, lineHeight: 1 }}>{imp.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: imp.count === 0 && imp.key !== 'passed' ? '#475569' : imp.color, lineHeight: 1.2 }}>
                  {imp.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
