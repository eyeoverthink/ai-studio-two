import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export const hasCredits = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const user = await prismadb.user.findUnique({
    where: { clerkId: userId }
  });

  return user?.credits ? user.credits > 0 : false;
};

export const getCredits = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  const user = await prismadb.user.findUnique({
    where: { clerkId: userId }
  });

  return user?.credits ?? 0;
};

export const decrementCredits = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const user = await prismadb.user.findUnique({
    where: { clerkId: userId }
  });

  if (!user || user.credits <= 0) {
    return false;
  }

  await prismadb.user.update({
    where: { id: user.id },
    data: {
      credits: {
        decrement: 1
      }
    }
  });

  return true;
};
