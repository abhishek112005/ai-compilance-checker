"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function AnalyticsDashboard() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = () => {
      const stored = localStorage.getItem("complianceHistory")
      if (stored) {
        try {
          setHistory(JSON.parse(stored))
        } catch (err) {
          console.error("Failed to load analytics:", err)
        }
      }
      setLoading(false)
    }

    loadAnalytics()

    const handleUpdate = () => {
      loadAnalytics()
    }

    window.addEventListener("complianceUpdated", handleUpdate)
    return () => window.removeEventListener("complianceUpdated", handleUpdate)
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl p-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading analytics...</p>
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No data yet</h3>
        <p className="text-sm text-slate-400 text-center">Start checking products to see analytics</p>
      </div>
    )
  }

  const totalProducts = history.length
  const averageScore = Math.round(history.reduce((sum, item) => sum + item.complianceScore, 0) / totalProducts)
  const passedProducts = history.filter((item) => item.status === "passed").length
  const failedProducts = history.filter((item) => item.status === "failed").length
  const passRate = Math.round((passedProducts / totalProducts) * 100)

  const dangerousProducts = history
    .filter((item) => item.complianceScore < 60)
    .sort((a, b) => a.complianceScore - b.complianceScore)

  const complianceDistribution = [
    { name: "Passed", value: passedProducts, fill: "#10b981" },
    { name: "Failed", value: failedProducts, fill: "#ef4444" },
  ]

  const scoresByProduct = history
    .slice()
    .reverse()
    .slice(0, 10)
    .map((item) => ({
      name: item.productName.substring(0, 20) + (item.productName.length > 20 ? "..." : ""),
      score: item.complianceScore,
    }))

  const scoreRanges = [
    { range: "0-20", count: history.filter((item) => item.complianceScore < 20).length },
    { range: "20-40", count: history.filter((item) => item.complianceScore >= 20 && item.complianceScore < 40).length },
    { range: "40-60", count: history.filter((item) => item.complianceScore >= 40 && item.complianceScore < 60).length },
    { range: "60-80", count: history.filter((item) => item.complianceScore >= 60 && item.complianceScore < 80).length },
    { range: "80-100", count: history.filter((item) => item.complianceScore >= 80).length },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-700/40 bg-gradient-to-br from-slate-800/40 to-slate-900/20 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Products Checked</p>
              <p className="text-3xl font-bold text-white">{totalProducts}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m0 0l8 4m0 0l8-4m0 0v10l-8 4m0 0l-8-4m0 0v-10"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/40 bg-gradient-to-br from-slate-800/40 to-slate-900/20 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Average Compliance Score</p>
              <p className="text-3xl font-bold text-white">{averageScore}%</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/40 bg-gradient-to-br from-slate-800/40 to-slate-900/20 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Pass Rate</p>
              <p className="text-3xl font-bold text-green-400">{passRate}%</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/40 bg-gradient-to-br from-slate-800/40 to-slate-900/20 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Flagged Products</p>
              <p className="text-3xl font-bold text-red-400">{dangerousProducts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2M4.22 4.22a9 9 0 1112.56 12.56M4.22 19.78a9 9 0 0012.56-12.56"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Compliance Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={complianceDistribution}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
              >
                {complianceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Score Distribution by Range</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="range" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Compliance Scores</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={scoresByProduct}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
            />
            <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {dangerousProducts.length > 0 && (
        <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Flagged Products (Score {"<"} 60%)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/40">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400">Product Name</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400">Score</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {dangerousProducts.map((item) => (
                  <tr key={item.id} className="border-b border-slate-700/20 hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4 text-sm text-slate-200">{item.productName.substring(0, 40)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-red-400">{item.complianceScore}%</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
                        {item.status === "failed" ? "Failed" : "Passed"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-slate-400">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
