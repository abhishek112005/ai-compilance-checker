"use client"

import { useState } from "react"

export function ComplaintForm() {
  const [formData, setFormData] = useState({
    productName: "",
    productUrl: "",
    complianceIssue: "",
    issueDetails: "",
    contactEmail: "",
    contactPhone: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Complaint submitted:", formData)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(true)
      setFormData({
        productName: "",
        productUrl: "",
        complianceIssue: "",
        issueDetails: "",
        contactEmail: "",
        contactPhone: "",
      })

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      console.error("Failed to submit complaint:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl p-8">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-2">File a Compliance Complaint</h3>
          <p className="text-slate-400 text-sm">
            Report non-compliant products to the regulatory authority. Your complaint will be forwarded to{" "}
            <span className="text-blue-400 font-semibold">vs.dhayal@nic.in</span>
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-lg border border-green-500/30 bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-green-200">
                Complaint submitted successfully! It will be reviewed by the regulatory authority.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Product Name *</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              placeholder="e.g., XYZ Food Product"
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Product URL</label>
            <input
              type="url"
              name="productUrl"
              value={formData.productUrl}
              onChange={handleChange}
              placeholder="https://www.amazon.com/dp/..."
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Compliance Issue *</label>
            <select
              name="complianceIssue"
              value={formData.complianceIssue}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
            >
              <option value="">Select an issue...</option>
              <option value="missing-ingredients">Missing Ingredients List</option>
              <option value="missing-allergens">Missing Allergen Information</option>
              <option value="missing-dates">Missing Expiry/Manufacturing Date</option>
              <option value="missing-manufacturer">Missing Manufacturer Details</option>
              <option value="misleading-claims">Misleading Health Claims</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Issue Details *</label>
            <textarea
              name="issueDetails"
              value={formData.issueDetails}
              onChange={handleChange}
              required
              placeholder="Please describe the compliance issue in detail..."
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email *</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Phone Number</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+91-XXXXXXXXXX"
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Complaint to vs.dhayal@nic.in"}
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-6 text-center">
          Your complaint will be reviewed and forwarded to the appropriate regulatory authority for action.
        </p>
      </div>
    </div>
  )
}
