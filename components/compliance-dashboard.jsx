"use client"

export function ComplianceDashboard({ results, uploadedImage, loading }) {
  const passedChecks = results.compliances.filter((c) => c.passed).length
  const totalChecks = results.compliances.length
  const compliancePercentage = Math.round((passedChecks / totalChecks) * 100)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-600/40 bg-gradient-to-br from-slate-800/40 to-slate-900/30 backdrop-blur-sm p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Compliance Score</p>
              <div className="text-3xl font-bold text-white">
                {compliancePercentage}
                <span className="text-base text-slate-400 font-normal">%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <div className="h-2 rounded-full bg-slate-700/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${compliancePercentage}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Passed</p>
              <p className="text-2xl font-bold text-green-400">{passedChecks}</p>
            </div>
            <svg className="w-6 h-6 text-green-400/50" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="rounded-lg border border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Failed</p>
              <p className="text-2xl font-bold text-red-400">{totalChecks - passedChecks}</p>
            </div>
            <svg className="w-6 h-6 text-red-400/50" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-600/40 bg-gradient-to-br from-slate-800/40 to-slate-900/30 backdrop-blur-sm p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h6a2 2 0 012 2v12a1 1 0 110 2h-6a1 1 0 110-2h6V4H6v12a1 1 0 110 2H6a2 2 0 01-2-2V4z" />
          </svg>
          Extracted Text (OCR)
        </h3>
        <div className="bg-slate-900/50 rounded-lg p-4 max-h-40 overflow-y-auto border border-slate-700/30">
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
            {results.extractedText || "No text extracted"}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 1 1 0 000 2H3v9a2 2 0 002 2h10a2 2 0 002-2V5h-3a1 1 0 000-2 2 2 0 00-2-2H6a2 2 0 00-2 2zm12 4a1 1 0 100 2H4a1 1 0 100-2h12z"
              clipRule="evenodd"
            />
          </svg>
          Compliance Checks
          <span className="ml-auto text-xs font-normal text-slate-400">{totalChecks} items</span>
        </h3>
        <div className="space-y-2.5 max-h-96 overflow-y-auto">
          {results.compliances.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-4 transition-all duration-300 backdrop-blur-sm ${
                item.passed
                  ? "border-green-500/30 bg-gradient-to-r from-green-500/10 to-transparent"
                  : "border-red-500/30 bg-gradient-to-r from-red-500/10 to-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {item.passed ? (
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{item.rule}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
