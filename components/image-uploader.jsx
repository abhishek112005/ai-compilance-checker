"use client"

import { useState, useRef } from "react"

export function ImageUploader({ onUpload, loading }) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(null)

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      setPreview(result)
      onUpload(file, result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type !== "dragleave")
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="h-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 cursor-pointer min-h-96 ${
          dragActive
            ? "border-blue-400 bg-blue-500/10 backdrop-blur-md"
            : "border-slate-600/50 bg-gradient-to-br from-slate-800/50 to-slate-900/40 hover:border-slate-500/50 hover:bg-slate-800/40 backdrop-blur-sm"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
          disabled={loading}
        />

        {preview ? (
          <div className="w-full flex flex-col items-center justify-center space-y-4">
            <div className="relative w-full">
              <img
                src={preview || "/placeholder.svg"}
                alt="Product preview"
                className="w-full h-64 object-cover rounded-xl border border-slate-600/50 shadow-lg"
              />
              {loading && (
                <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
                    <span className="text-xs text-blue-200 font-medium">Analyzing...</span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => !loading && fileInputRef.current?.click()}
              disabled={loading}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Processing..." : "Change image"}
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="font-semibold text-white text-base mb-1">Drop image here</p>
            <p className="text-sm text-slate-400 mb-4">or click to browse</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-2.5 py-1 text-xs rounded-lg bg-slate-700/40 border border-slate-600/50 text-slate-300">
                PNG
              </span>
              <span className="px-2.5 py-1 text-xs rounded-lg bg-slate-700/40 border border-slate-600/50 text-slate-300">
                JPG
              </span>
              <span className="px-2.5 py-1 text-xs rounded-lg bg-slate-700/40 border border-slate-600/50 text-slate-300">
                WebP
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
