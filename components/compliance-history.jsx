"use client"

import { useEffect, useState } from "react"

export function ComplianceHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = () => {
      const stored = localStorage.getItem("complianceHistory")
      if (stored) {
        try {
          setHistory(JSON.parse(stored))
        } catch (err) {
          console.error("Failed to load history:", err)
        }
      }
      setLoading(false)
    }

    loadHistory()

    const handleUpdate = () => {
      loadHistory()
    }

    window.addEventListener("complianceUpdated", handleUpdate)
    return () => window.removeEventListener("complianceUpdated", handleUpdate)
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl p-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading history...</p>
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl p-12 flex flex-col items-center justify-center min-h-96">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/15 border border-blue-500/20 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No history yet</h3>
        <p className="text-sm text-slate-400 text-center">Your compliance checks will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl overflow-hidden">
        <div className="divide-y divide-slate-700/40">
          {history.map((item) => (
            <div key={item.id} className="p-6 hover:bg-slate-800/20 transition-colors duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">{item.productName || "Product"}</h4>
                  {item.url && <p className="text-xs text-slate-400 truncate mb-2">{item.url}</p>}
                  <p className="text-xs text-slate-500">{new Date(item.date).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === "passed"
                        ? "bg-green-500/10 text-green-400 border border-green-500/30"
                        : "bg-red-500/10 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {item.status === "passed" ? "✓ Passed" : "✗ Failed"}
                  </div>
                  <p className="text-lg font-bold text-blue-400">{item.complianceScore}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
