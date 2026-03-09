"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface Invoice {
  id: number;
  totalAmount: number;
  currency: string;
  status: "PAID" | "PENDING" | string;
  issueDate: Date;
  invoiceNumber: string;
}
interface PrismaClientWithInvoices {
  id: number;
  name: string | null;
  email: string | null;
  country: string | null;
  invoices: Invoice[];
}

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
    include: { invoices: true },
    orderBy: { id: "desc" },
  });

  return clients.map((client: PrismaClientWithInvoices) => {
    const currency =
      client.invoices.length > 0 ? client.invoices[0].currency : "INR";

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      country: client.country,
      totalBilled: client.invoices.reduce(
        (sum: number, inv: Invoice) => sum + (inv.totalAmount || 0),
        0,
      ),
      invoiceCurrency: currency,
      invoiceCount: client.invoices.length,
      invoices: client.invoices,
    };
  });
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
// Unarchive Client
export async function unarchiveClientAction(clientId: number) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.client.update({
    where: { id: clientId },
    data: { isArchived: false },
  });

  revalidatePath("/clients");
}
// Render Archive Clients
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
