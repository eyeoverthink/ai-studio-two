import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from 'openai';
import { hasCredits, decrementCredits } from "@/lib/subscription";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { title, description, voiceType, prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title || !description || !voiceType || !prompt) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const credits = await hasCredits();
    
    if (!credits) {
      return new NextResponse("Not enough credits. Please purchase more credits to continue.", { status: 403 });
    }

    // Generate audio using OpenAI Text-to-Speech API
    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voiceType,
      input: prompt,
    });

    // Convert the response to a blob
    const buffer = Buffer.from(await mp3Response.arrayBuffer());
    
    // Convert buffer to base64
    const audioBase64 = buffer.toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

    // Decrement credits after successful generation
    await decrementCredits();

    return NextResponse.json({
      success: true,
      audioUrl,
      message: "Podcast generated successfully"
    });
    
  } catch (error) {
    console.log('[PODCAST_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
