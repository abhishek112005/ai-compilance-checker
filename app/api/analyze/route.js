import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const COMPLIANCE_RULES = [
  "Product name is clearly visible",
  "Ingredients list is complete and legible",
  "Allergen warnings are present",
  "Expiration/Best by date is visible",
  "Nutritional information is present",
  "Barcode or product code is visible",
  "Manufacturer information is included",
  "Weight/Volume measurements are displayed",
  "Storage instructions are provided",
  "Country of origin is specified",
]

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const productName = formData.get("productName")
    const productDescription = formData.get("productDescription")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" })

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const mimeType = file.type || "image/jpeg"

    let prompt = `Analyze this product image and perform two tasks:

1. Extract all visible text from the product (name, ingredients, warnings, dates, etc.). Support multi-language extraction.`

    if (productName || productDescription) {
      prompt += `

Product Context:
${productName ? `- Product Name: ${productName}` : ""}
${productDescription ? `- Description: ${productDescription}` : ""}

Use this context to better understand and validate the product.`
    }

    prompt += `

2. Check compliance with these rules:
${COMPLIANCE_RULES.map((rule, i) => `${i + 1}. ${rule}`).join("\n")}

Return a JSON object with this exact structure:
{
  "extractedText": "All extracted text here",
  "compliances": [
    {
      "rule": "Rule name",
      "passed": true/false,
      "details": "Brief explanation"
    }
  ]
}

Return ONLY valid JSON, no other text.`

    const response = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType: mimeType,
        },
      },
      {
        text: prompt,
      },
    ])

    let result = {
      extractedText: "",
      compliances: COMPLIANCE_RULES.map((rule) => ({
        rule,
        passed: false,
        details: "Unable to analyze",
      })),
      complianceScore: 0,
    }

    try {
      let responseText = response.response.text()

      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        responseText = jsonMatch[1]
      }

      const backtickMatch = responseText.match(/```([\s\S]*?)```/)
      if (backtickMatch && !jsonMatch) {
        responseText = backtickMatch[1]
      }

      const parsed = JSON.parse(responseText.trim())
      const compliances = parsed.compliances || result.compliances
      const passedCount = compliances.filter((c) => c.passed).length
      const complianceScore = Math.round((passedCount / COMPLIANCE_RULES.length) * 100)

      result = {
        extractedText: parsed.extractedText || "",
        compliances: compliances,
        complianceScore: complianceScore,
      }
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      return NextResponse.json({ error: "Failed to parse compliance analysis. Please try again." }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Analysis failed"

    if (errorMessage.includes("429") || errorMessage.includes("Resource exhausted")) {
      console.error("[v0] Rate limit exceeded:", errorMessage)
      return NextResponse.json(
        {
          error:
            "API rate limit exceeded. Please wait a moment and try again. Consider upgrading your Gemini API plan for higher limits.",
        },
        { status: 429 },
      )
    }

    if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
      console.error("[v0] Auth error:", errorMessage)
      return NextResponse.json(
        { error: "Invalid or missing Gemini API key. Please check your configuration." },
        { status: 401 },
      )
    }

    console.error("[v0] Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze image. Please try with a different image." }, { status: 500 })
  }
}
