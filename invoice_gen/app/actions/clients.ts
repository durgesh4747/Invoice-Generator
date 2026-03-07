"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

//  Fetch only acitve clients

export async function getClientsAction() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
  }

  const clients = await prisma.client.findMany({
    where: {
      userId: dbUser.id,
      isArchived: false,
    },
    include: {
      invoices: {
        select: { totalAmount: true },
      },
    },
    orderBy: { id: "desc" },
  });

  return clients.map((client: any) => ({
    id: client.id,
    name: client.name,
    email: client.email,
    country: client.country,
    totalBilled: client.invoices.reduce(
      (sum: number, inv: any) => sum + inv.totalAmount,
      0,
    ),
    invoiceCount: client.invoices.length,
  }));
}

//  Archive Client

export async function archiveClientAction(clientId: number) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.client.update({
    where: {
      id: clientId,
    },
    data: {
      isArchived: true,
    },
  });

  revalidatePath("/clients");
}

export async function unarchiveClientAction(clientId: number) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.client.update({
    where: { id: clientId },
    data: { isArchived: false },
  });

  revalidatePath("/clients");
}

export async function getArchivedClientsAction() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
  if (!dbUser) return [];

  return await prisma.client.findMany({
    where: {
      userId: dbUser.id,
      isArchived: true,
    },
    orderBy: { id: "desc" },
  });
}

// Saving Client Details
export async function saveClientAction(data: {
  name: string;
  email: string;
  country: string;
}) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
  if (!dbUser) throw new Error("User record not found");

  await prisma.client.create({
    data: {
      name: data.name,
      email: data.email,
      country: data.country || "Global",
      userId: dbUser.id,
    },
  });

  revalidatePath("/clients");
}
