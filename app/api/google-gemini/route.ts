import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userInstruction, userInput } = await req.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "NextJS Chat App"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "user",
              content: `${userInstruction}. The user input "${userInput}"`
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter Error:", err);
      return NextResponse.json(
        { role: "assistant", content: "❌ Model quota or API error." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({
      role: "assistant",
      content: text
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { role: "assistant", content: "❌ Server error." },
      { status: 500 }
    );
  }
}