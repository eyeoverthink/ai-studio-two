import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { checkAndDeductCredits } from "@/lib/credits";
import prisma from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BLOG_GENERATION_COST = 5;

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { topic, tone, length } = body;

    if (!topic) {
      return new NextResponse("Topic is required", { status: 400 });
    }

    // Check and deduct credits
    const success = await checkAndDeductCredits(userId, BLOG_GENERATION_COST);
    if (!success) {
      return new NextResponse("Insufficient credits", { status: 402 });
    }

    let wordCount;
    switch (length) {
      case "short":
        wordCount = 300;
        break;
      case "medium":
        wordCount = 600;
        break;
      case "long":
        wordCount = 1000;
        break;
      default:
        wordCount = 600;
    }

    const prompt = `Write a ${wordCount}-word blog post about "${topic}" in a ${tone} tone. 
    The blog should be well-structured with proper headings and paragraphs. 
    Include an introduction, main points with supporting details, and a conclusion.
    Format the output in HTML with appropriate tags (<h1>, <p>, etc.).`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: Math.floor(wordCount * 2),
    });

    const content = completion.choices[0].message.content;

    // Create a record of the generated content
    const contentRecord = await prisma.content.create({
      data: {
        title: topic,
        description: content?.slice(0, 200) + "..." || "",
        type: "BLOG",
        url: "", // Will be updated with the actual URL
        userId: userId,
        tags: [tone, length],
      },
    });

    return NextResponse.json({
      content: content,
      contentId: contentRecord.id,
    });
  } catch (error) {
    console.error("[BLOG_GENERATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
