export interface ComplianceCheck {
  rule: string
  passed: boolean
  details: string
}

export interface ComplianceResult {
  extractedText: string
  compliances: ComplianceCheck[]
}
