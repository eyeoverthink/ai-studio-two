import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Verify the content belongs to the user
    const content = await prisma.content.findUnique({
      where: { id: params.contentId },
    });

    if (!content || content.userId !== user.id) {
      return new NextResponse("Content not found", { status: 404 });
    }

    // Delete the content
    await prisma.content.delete({
      where: { id: params.contentId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CONTENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
