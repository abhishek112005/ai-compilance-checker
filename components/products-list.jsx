"use client"

import { useEffect, useState } from "react"
import { ComplianceDashboard } from "@/components/compliance-dashboard"

export function ProductsList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://flipkart-backend-8z7t.onrender.com/api/v1/product/all-products")
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()

        const productsList = Array.isArray(data) ? data : data.products || []
        const mappedProducts = productsList.slice(0, 12).map((product) => ({
          id: product._id || product.id || Math.random().toString(),
          title: product.name || product.title || "Untitled Product",
          image: product.brand?.logo?.url || "/placeholder.svg",
          price: product.price,
          originalProduct: product,
        }))
        setProducts(mappedProducts)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleCheckCompliance = async (product, index) => {
    try {
      setProducts((prev) =>
        prev.map((p, i) => (i === index ? { ...p, complianceLoading: true, complianceError: undefined } : p)),
      )

      const imageUrl =
        product.originalProduct?.image?.url || product.originalProduct?.productImage?.url || product.image

      const imageResponse = await fetch(imageUrl)
      if (!imageResponse.ok) throw new Error("Failed to fetch product image")

      const blob = await imageResponse.blob()
      const file = new File([blob], `${product.id}.jpg`, { type: "image/jpeg" })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("productName", product.title)
      formData.append("productDescription", product.originalProduct?.description || "")

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const complianceResults = await response.json()

      if (!complianceResults || !complianceResults.complianceScore) {
        throw new Error("Invalid compliance results received")
      }

      const historyItem = {
        id: `${product.id}-${Date.now()}`,
        productName: product.title,
        complianceScore: complianceResults.complianceScore,
        date: new Date().toISOString(),
        status: complianceResults.complianceScore >= 60 ? "passed" : "failed",
      }

      const stored = localStorage.getItem("complianceHistory")
      const history = stored ? JSON.parse(stored) : []
      history.push(historyItem)
      localStorage.setItem("complianceHistory", JSON.stringify(history))

      window.dispatchEvent(new CustomEvent("complianceUpdated", { detail: historyItem }))

      const updatedProduct = {
        ...product,
        complianceLoading: false,
        complianceResults,
      }

      setProducts((prev) => prev.map((p, i) => (i === index ? updatedProduct : p)))
      setSelectedProduct(updatedProduct)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Analysis failed"

      setProducts((prev) =>
        prev.map((p, i) =>
          i === index
            ? {
                ...p,
                complianceLoading: false,
                complianceError: errorMessage,
              }
            : p,
        ),
      )
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl p-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/5 to-red-600/5 backdrop-blur-sm p-8">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-200">Failed to Load Products</p>
            <p className="text-sm text-red-100/70 mt-0.5">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl p-12 flex flex-col items-center justify-center min-h-96">
        <svg className="w-8 h-8 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m-8-4l-8-4"
          />
        </svg>
        <p className="text-slate-400">No products available</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {selectedProduct && selectedProduct.complianceResults ? (
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl overflow-hidden">
              <div className="h-48 bg-slate-900/50 overflow-hidden">
                <img
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/diverse-products-still-life.png"
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm mb-4">{selectedProduct.title}</h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white text-sm font-semibold transition-all duration-200"
                >
                  Back to Products
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <ComplianceDashboard
              results={selectedProduct.complianceResults}
              uploadedImage={selectedProduct.image}
              loading={false}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="rounded-xl border border-slate-700/40 bg-gradient-to-br from-slate-800/50 to-slate-900/40 backdrop-blur-sm overflow-hidden hover:border-slate-600/60 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 bg-slate-900/50 overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/diverse-products-still-life.png"
                    }}
                  />
                </div>

                <div className="flex-1 p-4 flex flex-col">
                  <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">{product.title}</h3>
                  {product.price && <p className="text-blue-400 font-bold text-sm mb-4">₹{product.price}</p>}

                  {product.complianceResults ? (
                    <div
                      onClick={() => setSelectedProduct(product)}
                      className="mb-4 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 cursor-pointer hover:border-green-500/40 transition-all"
                    >
                      <p className="text-xs text-green-200 font-semibold mb-1">Compliance Score</p>
                      <p className="text-lg font-bold text-green-400">{product.complianceResults.complianceScore}%</p>
                      <p className="text-xs text-green-300/70 mt-1">Click to view details</p>
                    </div>
                  ) : product.complianceError ? (
                    <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
                      <p className="text-xs text-red-200 font-semibold">Error</p>
                      <p className="text-xs text-red-100/70">{product.complianceError}</p>
                    </div>
                  ) : null}

                  <button
                    onClick={() => handleCheckCompliance(product, index)}
                    disabled={product.complianceLoading}
                    className="mt-auto px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {product.complianceLoading ? (
                      <>
                        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Check Compliance
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
