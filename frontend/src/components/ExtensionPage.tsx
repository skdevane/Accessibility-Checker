import React from 'react';

interface ExtensionPageProps {
  githubRepoUrl?: string;
}

export const ExtensionPage: React.FC<ExtensionPageProps> = ({
  githubRepoUrl = 'https://github.com/your-username/accessibility-checker',
}) => {
  const downloadUrl = `${githubRepoUrl}/releases/latest/download/accessibility-extension.zip`;

  return (
    <section aria-labelledby="extension-heading" className="space-y-8 animate-fade-in">
      {/* Hero Header for Extension */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-purple-200 card-shadow p-6 sm:p-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-100 border-2 border-teal-300 text-3xl mb-2">
          🧩
        </div>
        <h2
          id="extension-heading"
          className="font-hand text-3xl font-bold text-purple-900 tracking-wide"
        >
          Accessibility Auditor Chrome Extension
        </h2>
        <p className="text-gray-700 text-base max-w-xl mx-auto leading-relaxed">
          Audit any website in real-time directly inside your browser. Powered by <strong className="text-teal-700">axe-core</strong>, our lightweight extension highlights accessibility violations directly on your screen.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 focus:bg-teal-600 text-white font-bold text-base px-6 py-3 rounded-2xl card-shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-teal-300 active:scale-95"
            aria-label="Download Extension ZIP from GitHub Releases (opens in new tab)"
          >
            <span>⬇️</span>
            <span>Download Extension (.zip)</span>
          </a>

          <a
            href={githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-purple-50 text-purple-700 font-bold text-base px-6 py-3 rounded-2xl border-2 border-purple-300 card-shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-purple-300 active:scale-95"
            aria-label="View Source Code on GitHub (opens in new tab)"
          >
            <span>⭐</span>
            <span>View Source on GitHub</span>
          </a>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border-2 border-purple-200 card-shadow p-5 space-y-2">
          <div className="text-2xl" aria-hidden="true">⚡</div>
          <h3 className="font-bold text-purple-800 text-lg">Instant Auditing</h3>
          <p className="text-sm text-gray-600">
            Scan live web pages in milliseconds without needing a backend server or complex setups.
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-purple-200 card-shadow p-5 space-y-2">
          <div className="text-2xl" aria-hidden="true">🎯</div>
          <h3 className="font-bold text-purple-800 text-lg">Visual DOM Highlights</h3>
          <p className="text-sm text-gray-600">
            Directly highlights non-compliant elements on the page with clear WCAG impact badges.
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-purple-200 card-shadow p-5 space-y-2">
          <div className="text-2xl" aria-hidden="true">🔒</div>
          <h3 className="font-bold text-purple-800 text-lg">100% Private & Local</h3>
          <p className="text-sm text-gray-600">
            All audits run strictly inside your browser sandbox. No tracking, logging, or third-party analytical telemetry.
          </p>
        </div>
      </div>

      {/* Step-by-Step Installation Guide */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-purple-200 card-shadow p-6 sm:p-8 space-y-6">
        <h3 className="font-hand text-2xl font-bold text-purple-900 border-b-2 border-purple-100 pb-3">
          📖 How to Install in Chrome / Edge / Brave
        </h3>

        <ol className="space-y-4 list-none p-0">
          <li className="flex items-start gap-4">
            <span className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white font-bold text-sm">
              1
            </span>
            <div className="space-y-1">
              <p className="font-semibold text-gray-800">Download the Extension Package</p>
              <p className="text-sm text-gray-600">
                Click the <strong>Download Extension (.zip)</strong> button above to download the latest automated release build from GitHub.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <span className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white font-bold text-sm">
              2
            </span>
            <div className="space-y-1">
              <p className="font-semibold text-gray-800">Unzip the File</p>
              <p className="text-sm text-gray-600">
                Extract the downloaded <code className="bg-gray-100 text-purple-700 px-2 py-0.5 rounded border border-gray-300">accessibility-extension.zip</code> file to a folder on your computer.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <span className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white font-bold text-sm">
              3
            </span>
            <div className="space-y-1">
              <p className="font-semibold text-gray-800">Open Chrome Extension Manager</p>
              <p className="text-sm text-gray-600">
                Open Google Chrome and navigate to <code className="bg-gray-100 text-purple-700 px-2 py-0.5 rounded border border-gray-300">chrome://extensions</code> in your URL bar.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <span className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white font-bold text-sm">
              4
            </span>
            <div className="space-y-1">
              <p className="font-semibold text-gray-800">Enable Developer Mode & Load Unpacked</p>
              <p className="text-sm text-gray-600">
                Turn on the <strong>Developer mode</strong> toggle in the top-right corner. Click <strong>Load unpacked</strong> and select your extracted extension folder.
              </p>
            </div>
          </li>
        </ol>

        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-sm text-amber-900" role="note">
          <span className="text-xl shrink-0" aria-hidden="true">💡</span>
          <p>
            <strong>Pro-tip for Apple/Accessibility interviews:</strong> Once installed, click the puzzle icon in Chrome and pin <strong>Accessibility Auditor</strong> to your toolbar for 1-click audits on any site!
          </p>
        </div>
      </div>
    </section>
  );
};
