import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from 'openai';
import { checkAndDeductCredits } from "@/lib/credits";
import prisma from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API,
  baseURL: 'https://api.openai.com/v1', // Using default OpenAI URL
  defaultHeaders: {
    'User-Agent': 'Creative AI Studio'
  }
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

    // Verify OpenAI API key
    if (!openai.apiKey) {
      console.error('[PODCAST_ERROR] OpenAI API key is not configured');
      return new NextResponse("Server configuration error", { status: 500 });
    }

    // Get user and check credits
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, credits: true }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.credits < 1) {
      return new NextResponse("Insufficient credits", { status: 403 });
    }

    // Generate audio using OpenAI Text-to-Speech API
    let mp3Response;
    try {
      mp3Response = await openai.audio.speech.create({
        model: "tts-1",
        voice: voiceType,
        input: prompt,
      });
    } catch (openaiError: any) {
      console.error('[OPENAI_ERROR]', openaiError?.message || openaiError);
      return new NextResponse(
        `OpenAI API error: ${openaiError?.message || 'Unknown error'}`,
        { status: 500 }
      );
    }

    // Convert the response to a buffer with error handling
    let audioBase64;
    try {
      const buffer = Buffer.from(await mp3Response.arrayBuffer());
      audioBase64 = buffer.toString('base64');
    } catch (bufferError) {
      console.error('[BUFFER_ERROR]', bufferError);
      return new NextResponse("Error processing audio data", { status: 500 });
    }

    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

    // Deduct credits after successful generation
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } }
    });

    return NextResponse.json({
      success: true,
      audioUrl,
      message: "Podcast generated successfully",
      creditsRemaining: user.credits - 1
    });
    
  } catch (error) {
    console.error('[PODCAST_ERROR]', error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error",
      { status: 500 }
    );
  }
}
