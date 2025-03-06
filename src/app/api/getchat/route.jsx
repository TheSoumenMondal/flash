import { chatSession } from "@/config/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompts } = await req.json(); // Destructure 'prompts' from the request
        console.log(prompts);

        const result = await chatSession.sendMessage(prompts.text); // Use prompts.text
        const AIres = await result.response.text();
        
        return NextResponse.json({
            result: AIres
        });
    } catch (error) {
        return NextResponse.json({
            error: error.message
        });
    }
}
