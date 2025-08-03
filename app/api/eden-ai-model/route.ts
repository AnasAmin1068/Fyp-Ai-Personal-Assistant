import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { provider, userInput } = await req.json()

  const headers = {
    Authorization: "Bearer " + process.env.OPENAI_API_KEY,
    'Content-Type': 'application/json'
  }

  const url = "https://api.edenai.run/v2/llm/chat"

  const body = JSON.stringify({
    providers: [provider],
    messages: [
      {
        role: "user",
        content: userInput
      }
    ]
  })

  const response = await fetch(url, {
    method: "POST",
    headers,
    body
  })

  const result = await response.json()
  console.log("Eden AI full response:", result)

  // ✅ Safely get the first response with content
  const providerKey = Object.keys(result).find(key => result[key]?.generated_text)

  const resp = {
    role: "assistant",
    content: providerKey ? result[providerKey].generated_text : "No response"
  }

  return NextResponse.json(resp)
}


