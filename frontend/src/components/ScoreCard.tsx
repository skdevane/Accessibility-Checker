interface ScoreCardProps {
  score: number;
  url: string;
  issueCount: number;
  scannedAt: string;
}

function scoreBand(score: number): {
  label: string;
  ringColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  emoji: string;
} {
  if (score >= 80)
    return {
      label: 'Great!',
      ringColor: '#34d399',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      emoji: '🎉',
    };
  if (score >= 50)
    return {
      label: 'Needs Work',
      ringColor: '#fbbf24',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      emoji: '🔧',
    };
  return {
    label: 'Critical!',
    ringColor: '#f87171',
    textColor: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-300',
    emoji: '🚨',
  };
}

export function ScoreCard({ score, url, issueCount, scannedAt }: ScoreCardProps) {
  const { label, ringColor, textColor, bgColor, borderColor, emoji } = scoreBand(score);
  const formattedDate = new Date(scannedAt).toLocaleString();

  // SVG ring maths
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.3
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`bg-white rounded-2xl border-2 ${borderColor} card-shadow p-5 flex flex-col sm:flex-row items-center gap-6 animate-fade-in`}>
      {/* Score ring */}
      <div className={`shrink-0 ${bgColor} rounded-2xl p-3 flex flex-col items-center justify-center`}>
        <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
          {/* Track */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="#e9d5ff"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1s ease-out',
            }}
          />
        </svg>
        {/* Number overlay */}
        <div className="-mt-2 flex flex-col items-center">
          <span className={`text-3xl font-extrabold tabular-nums ${textColor}`}>{score}</span>
          <span className={`text-xs font-bold ${textColor}`}>{emoji} {label}</span>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-1">Scanned URL</p>
        <p className="text-purple-900 font-bold truncate text-sm">{url}</p>

        <div className="mt-3 flex flex-wrap gap-3">
          <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 card-shadow-sm">
            <p className="text-purple-400 text-xs font-medium">Issues found</p>
            <p className={`text-xl font-extrabold ${issueCount === 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {issueCount}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 card-shadow-sm">
            <p className="text-purple-400 text-xs font-medium">Scanned at</p>
            <p className="text-purple-800 font-semibold text-sm">{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
