import { NextResponse } from 'next/server'
import { GenAiCode } from "@/config/AiModel";

export async function POST(req) {
  const { prompts } = await req.json();
    console.log("Received prompts:", prompts);
  try {  
    // Send the prompt to your AI model and extract the response text
    const result = await GenAiCode.sendMessage(prompts);
    console.log("AI response:", result);
    // Return the response text as JSON
    const AIres = result.response.text();
    return NextResponse.json(JSON.parse(AIres));
  } catch (error) {
    console.error("Error generating AI code:", error);
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
