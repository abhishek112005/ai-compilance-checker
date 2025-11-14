"use client"

import { useState } from "react"
import { ImageUploader } from "@/components/image-uploader"
import { ComplianceDashboard } from "@/components/compliance-dashboard"
import { ProductsList } from "@/components/products-list"
import { ComplianceHistory } from "@/components/compliance-history"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { ComplaintForm } from "@/components/complaint-form"
import { useCompliance } from "@/hooks/use-compliance"

export function ComplianceCheckerApp() {
  const [activeTab, setActiveTab] = useState("upload")
  const { analyze, results, loading, error } = useCompliance()

  const handleUpload = async (file, preview) => {
    await analyze(file)

    const historyItem = {
      id: `${Date.now()}`,
      productName: file.name,
      complianceScore: Math.floor(Math.random() * 100),
      date: new Date().toISOString(),
      status: Math.random() > 0.5 ? "passed" : "failed",
    }

    const stored = localStorage.getItem("complianceHistory")
    const history = stored ? JSON.parse(stored) : []
    history.push(historyItem)
    localStorage.setItem("complianceHistory", JSON.stringify(history))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Compliance Checker</h1>
          <p className="text-slate-400">AI-powered product compliance analysis using OCR</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: "upload", label: "Manual Upload" },
            { id: "products", label: "Browse Products" },
            { id: "history", label: "History" },
            { id: "analytics", label: "Analytics" },
            { id: "complaint", label: "File Complaint" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "upload" && (
            <div className="grid lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-2">
                <ImageUploader onUpload={handleUpload} loading={loading} />
              </div>
              <div className="lg:col-span-3">
                {results && <ComplianceDashboard results={results} uploadedImage={null} loading={loading} />}
                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                )}
                {!results && !loading && !error && (
                  <div className="rounded-lg border border-slate-700/40 bg-slate-800/20 p-8 text-center">
                    <p className="text-slate-400">Upload an image to see compliance analysis</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "products" && <ProductsList />}

          {activeTab === "history" && <ComplianceHistory />}

          {activeTab === "analytics" && <AnalyticsDashboard />}

          {activeTab === "complaint" && <ComplaintForm />}
        </div>
      </div>
    </div>
  )
}
