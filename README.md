# Compliance Checker React Library

A powerful AI-driven React component library for product compliance validation using Google's Gemini Vision API.

## Installation

\`\`\`bash
npm install @compliance-checker/react
# or
yarn add @compliance-checker/react
\`\`\`

## Quick Start

\`\`\`tsx
import { ComplianceCheckerApp } from '@compliance-checker/react'
import '@compliance-checker/react/styles'

export default function App() {
  return (
    <ComplianceCheckerApp
      title="Product Compliance Checker"
      description="Validate product compliance with AI"
      complaintEmail="your-email@example.com"
    />
  )
}
\`\`\`

## Individual Components

\`\`\`tsx
import { 
  ImageUploader, 
  ComplianceDashboard, 
  useCompliance 
} from '@compliance-checker/react'

function MyComponent() {
  const { analyze, results, loading } = useCompliance()
  
  return (
    <>
      <ImageUploader onUpload={(file) => analyze(file)} />
      {results && <ComplianceDashboard results={results} />}
    </>
  )
}
\`\`\`

## API Endpoint Setup

This library requires a backend API endpoint at `/api/analyze` that handles image analysis using Gemini Vision API.

## Required Environment Variables

- `GEMINI_API_KEY` - Google Gemini API key

## Components

- `ComplianceCheckerApp` - Full-featured compliance app
- `ImageUploader` - Image upload component
- `ComplianceDashboard` - Compliance results display
- `ProductsList` - Product browsing
- `ComplianceHistory` - History tracking
- `AnalyticsDashboard` - Analytics visualization
- `ComplaintForm` - Complaint submission

## Hooks

- `useCompliance()` - Core compliance analysis hook

## License

MIT
