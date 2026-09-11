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

const STAGE_4_DETAILS = [
  'Auditing color contrast & text ratios...',
  'Checking ARIA roles & landmark semantics...',
  'Verifying form labels & interactive elements...',
  'Validating heading hierarchy & document titles...',
  'Calculating WCAG impact & severity breakdown...',
];

export function ScanProgress() {
  const [percent, setPercent] = useState(5);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [subDetailIndex, setSubDetailIndex] = useState(0);

  // Smooth continuous percentage ticker (1% -> 95%)
  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 95) return 95; // Hold at 95% until API responds
        // Progress fast initially, then slow down smoothly as it reaches 90%+
        const increment = prev < 40 ? 4 : prev < 70 ? 2 : prev < 88 ? 1 : 0.4;
        return Math.min(95, parseFloat((prev + increment).toFixed(1)));
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  // Update active stage & detail based on percentage progress
  useEffect(() => {
    if (percent < 20) {
      setCurrentStageIndex(0);
    } else if (percent < 45) {
      setCurrentStageIndex(1);
    } else if (percent < 60) {
      setCurrentStageIndex(2);
    } else if (percent < 80) {
      setCurrentStageIndex(3);
    } else {
      setCurrentStageIndex(4);
    }
  }, [percent]);

  // Rotate micro-detail text while generating report to keep user engaged
  useEffect(() => {
    if (currentStageIndex >= 3) {
      const detailTimer = setInterval(() => {
        setSubDetailIndex((prev) => (prev + 1) % STAGE_4_DETAILS.length);
      }, 1800);
      return () => clearInterval(detailTimer);
    }
  }, [currentStageIndex]);

  const activeStage = STAGES[currentStageIndex];
  const activeDetail = currentStageIndex >= 3 ? STAGE_4_DETAILS[subDetailIndex] : activeStage.detail;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-purple-200 card-shadow p-6 mb-6 animate-fade-in space-y-5">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce" aria-hidden="true">
            {activeStage.icon}
          </span>
          <div>
            <h3 className="font-hand text-xl text-purple-900 font-bold flex items-center gap-2">
              <span>Scanning in Progress...</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
            </h3>
            <p className="text-purple-600 text-xs font-medium transition-all duration-300">
              {activeDetail}
            </p>
          </div>
        </div>

        {/* Dynamic Percentage Badge */}
        <div className="flex flex-col items-end">
          <span className="text-lg font-extrabold text-teal-600 bg-teal-50 px-3.5 py-1 rounded-2xl border-2 border-teal-200 tabular-nums shadow-sm">
            {Math.floor(percent)}%
          </span>
          <span className="text-[10px] text-purple-400 font-semibold mt-0.5">
            {percent >= 80 ? 'Finalizing analysis...' : 'Processing...'}
          </span>
        </div>
      </div>

      {/* Animated Multi-color Progress Bar */}
      <div className="relative w-full bg-purple-100/80 rounded-full h-4 overflow-hidden p-0.5 border-2 border-purple-200 shadow-inner">
        <div
          className="bg-gradient-to-r from-purple-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-200 ease-out shadow-sm"
          style={{ width: `${percent}%` }}
        />
        {/* Shimmer overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse pointer-events-none" />
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
                  ? 'bg-purple-50 border-purple-300 shadow-sm ring-2 ring-purple-400/40 scale-[1.02]'
                  : isDone
                  ? 'bg-emerald-50/60 border-emerald-200 opacity-90'
                  : 'bg-slate-50/50 border-slate-200 opacity-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-purple-600 text-white animate-pulse shadow-sm'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? '✓' : stage.id}
              </div>

              <div className="min-w-0">
                <p
                  className={`text-xs font-bold truncate ${
                    isActive
                      ? 'text-purple-900 font-extrabold'
                      : isDone
                      ? 'text-emerald-800'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </p>
                {isActive && (
                  <p className="text-[10px] text-teal-600 font-semibold animate-pulse sm:block hidden">
                    Active...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
