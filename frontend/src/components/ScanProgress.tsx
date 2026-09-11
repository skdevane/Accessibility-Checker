import { useState, useEffect } from 'react';

export interface ScanStage {
  id: number;
  label: string;
  detail: string;
  icon: string;
}

const STAGES: ScanStage[] = [
  { id: 1, label: 'Launching Browser', detail: 'Spinning up Playwright Chromium instance...', icon: '🚀' },
  { id: 2, label: 'Loading Page', detail: 'Fetching DOM and waiting for page render...', icon: '🌐' },
  { id: 3, label: 'Injecting axe-core', detail: 'Loading WCAG 2.1 & 2.2 rule definitions...', icon: '🔬' },
  { id: 4, label: 'Evaluating Rules', detail: 'Auditing DOM elements, color contrast, and ARIA...', icon: '⚡' },
  { id: 5, label: 'Generating Report', detail: 'Calculating impact breakdown and scoring...', icon: '📊' },
];

export function ScanProgress() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    // Progress through stages automatically to keep user informed while Playwright runs
    const intervals = [700, 1200, 1000, 1500]; // Timings matching typical scan sequence
    let timeoutId: ReturnType<typeof setTimeout>;

    const advanceStage = (index: number) => {
      if (index < STAGES.length - 1) {
        timeoutId = setTimeout(() => {
          setCurrentStageIndex(index + 1);
          advanceStage(index + 1);
        }, intervals[index] || 1000);
      }
    };

    advanceStage(0);

    return () => clearTimeout(timeoutId);
  }, []);

  const progressPercent = Math.min(100, Math.round(((currentStageIndex + 1) / STAGES.length) * 100));
  const activeStage = STAGES[currentStageIndex];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-purple-200 card-shadow p-6 mb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-bounce" aria-hidden="true">{activeStage.icon}</span>
          <div>
            <h3 className="font-hand text-xl text-purple-900 font-bold">Scanning in Progress...</h3>
            <p className="text-purple-500 text-xs font-medium">{activeStage.detail}</p>
          </div>
        </div>
        <span className="text-sm font-extrabold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 tabular-nums">
          {progressPercent}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-purple-100 rounded-full h-3 mb-6 overflow-hidden p-0.5 border border-purple-200">
        <div
          className="bg-gradient-to-r from-purple-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Stage Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isActive = idx === currentStageIndex;

          return (
            <div
              key={stage.id}
              className={`flex sm:flex-col items-center gap-2 p-2.5 rounded-xl border text-left sm:text-center transition-all duration-300 ${
                isActive
                  ? 'bg-purple-50 border-purple-300 shadow-sm ring-2 ring-purple-400/30'
                  : isDone
                  ? 'bg-emerald-50/60 border-emerald-200 opacity-90'
                  : 'bg-slate-50/50 border-slate-200 opacity-40'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-purple-600 text-white animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? '✓' : stage.id}
              </div>

              <div className="min-w-0">
                <p
                  className={`text-xs font-bold truncate ${
                    isActive
                      ? 'text-purple-900'
                      : isDone
                      ? 'text-emerald-800'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
