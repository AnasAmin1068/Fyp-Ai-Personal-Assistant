import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json()

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: userInput
          }
        ]
      })
    })

    const data = await response.json()
    console.log("OpenAI response:", data)

    const content = data?.choices?.[0]?.message?.content || "No response"

    return NextResponse.json({ role: "assistant", content })
  } catch (error) {
    console.error("Error in OpenAI API route:", error)
    return NextResponse.json({ role: "assistant", content: "Error processing request." })
  }
}
