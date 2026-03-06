import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";

export default async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User doesn't exist.");
  }
  let user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });
  if (!user) {  
    user = await prisma.user.create({
      data:{
        clerkId:userId,
      }
    })
  }
  return user;
}
