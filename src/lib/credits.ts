import prisma from "@/lib/prisma";

export async function checkAndDeductCredits(userId: string, creditCost: number) {
  // Fetch user's current credits
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true }
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if user has enough credits
  if (user.credits < creditCost) {
    throw new Error("Insufficient credits");
  }

  // Deduct credits
  await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: creditCost } }
  });

  return true;
}
