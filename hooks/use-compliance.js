"use client"

import { useState } from "react"

export function useCompliance() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = async (file) => {
    setLoading(true)
    setError(null)
    try {
      let formData

      if (typeof file === "string") {
        const binaryString = atob(file)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: "image/jpeg" })
        const fileObj = new File([blob], "product-image.jpg", { type: "image/jpeg" })
        formData = new FormData()
        formData.append("file", fileObj)
      } else {
        formData = new FormData()
        formData.append("file", file)
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const result = await response.json()
      setResults(result)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Analysis failed"
      console.error("[v0] Analysis error:", errorMsg)
      setError(errorMsg)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  return { analyze, results, loading, error }
}
