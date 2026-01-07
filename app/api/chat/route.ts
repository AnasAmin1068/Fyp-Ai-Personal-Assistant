import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userInstruction, userInput } = await req.json();

const response = await fetch(
  "https://api.openai.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-5-nano", 
      messages: [
        {
          role: "assistant",
          content: userInstruction
        },
        {
          role: "user",
          content: userInput
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
    const rawText = data.choices?.[0]?.message?.content || "";
    const cleanedText = rawText
      .replace(/<s>/g, "")
      .replace(/<\/s>/g, "")
      .replace(/\[B_INST\]/g, "")
      .replace(/\[\/B_INST\]/g, "")
      .trim();

    return NextResponse.json({
      role: "assistant",
      content: cleanedText
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { role: "assistant", content: "❌ Server error." },
      { status: 500 }
    );
  }
}