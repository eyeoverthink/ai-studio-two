import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VIDEO_GENERATION_COST = 10;

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { prompt, duration, style } = body;

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // Check if user has enough credits
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { credits: true, id: true },
    });

    if (!user || user.credits < VIDEO_GENERATION_COST) {
      return new NextResponse("Insufficient credits", { status: 402 });
    }

    // Deduct credits
    await prisma.user.update({
      where: { clerkId: userId },
      data: { credits: { decrement: VIDEO_GENERATION_COST } },
    });

    // TODO: Integrate with actual video generation API
    // For now, we'll simulate video generation with a delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Create a record of the generated content
    const content = await prisma.content.create({
      data: {
        title: prompt.slice(0, 50) + "...",
        description: prompt,
        type: "VIDEO",
        url: "https://example.com/video.mp4", // Replace with actual video URL
        thumbnail: "https://example.com/thumbnail.jpg", // Replace with actual thumbnail
        userId: user.id,
        tags: [style, `${duration}s`],
      },
    });

    // In a real implementation, you would:
    // 1. Call your video generation API
    // 2. Upload the video to cloud storage
    // 3. Return the actual video URL

    return NextResponse.json({
      url: "https://example.com/video.mp4",
      content: content,
    });
  } catch (error) {
    console.error("[VIDEO_GENERATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
