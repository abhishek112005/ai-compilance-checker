export interface ComplianceCheck {
  rule: string
  passed: boolean
  details: string
}

export interface ComplianceResult {
  extractedText: string
  compliances: ComplianceCheck[]
  complianceScore: number
}

export interface ComplianceHistory {
  id: string
  productName: string
  image: string
  score: number
  status: "passed" | "failed"
  date: string
  details: ComplianceResult
}

export interface Product {
  _id: string
  name: string
  description: string
  brand: {
    name: string
    logo: {
      url: string
    }
  }
}
