"use server";

import prisma from "@/lib/prisma";
import { InvoiceItem, InvoicePayload } from "@/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInvoiceAction(payload: InvoicePayload) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const {
    id,
    items,
    fromName,
    fromEmail,
    clientName,
    clientEmail,
    clientRegion,
    currency,
    taxRate,
    taxLabel,
    discountAmount,
    amountPaid,
    notes,
    issueDate,
    dueDate,
    status,
  } = payload;

  // 1. Calculations
  const subtotal = items.reduce(
    (sum: number, item: InvoiceItem) =>
      sum + (Number(item.quantity) * Number(item.price) || 0),
    0,
  );
  const discountVal = Number(discountAmount) || 0;
  const taxVal = (subtotal - discountVal) * (Number(taxRate) / 100);
  const totalAmount = subtotal - discountVal + taxVal;

  const internalUser = await prisma.user.findUnique({ where: { clerkId } });
  if (!internalUser) throw new Error("User not found");

  // 2. Database Transaction
  await prisma.$transaction(async (tx) => {
    let targetClientId = payload.clientId ? Number(payload.clientId) : null;

    if (!targetClientId && clientEmail) {
      const existingClient = await tx.client.findFirst({
        where: { email: clientEmail, userId: internalUser.id },
      });

      if (existingClient) {
        targetClientId = existingClient.id;
      } else {
        const newClient = await tx.client.create({
          data: {
            name: clientName,
            email: clientEmail,
            country: clientRegion || "Global",
            userId: internalUser.id,
          },
        });
        targetClientId = newClient.id;
      }
    }

    if (id) {
      // UPDATE INVOICE
      await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
      return await tx.invoice.update({
        where: { id: id },
        data: {
          fromName,
          fromEmail,
          clientName,
          clientEmail,
          clientRegion,
          currency,
          subtotal,
          taxRate: Number(taxRate),
          taxLabel,
          discountAmount: Number(discountAmount),
          amountPaid: Number(amountPaid) || 0,
          totalAmount,
          notes,
          issueDate: new Date(issueDate),
          dueDate: new Date(dueDate),
          status: status,
          clientId: targetClientId,
          items: {
            create: items.map((item: InvoiceItem) => ({
              type: item.type || "Service",
              description: item.description,
              quantity: Number(item.quantity),
              price: Number(item.price),
            })),
          },
        },
      });
    }

    //  SEQUENTIAL INVOICE NUMBER LOGIC
    const lastInvoice = await tx.invoice.findFirst({
      where: { userId: internalUser.id },
      orderBy: { createdAt: "desc" },
      select: { invoiceNumber: true },
    });

    let nextInvoiceNumber = "INV-001";
    if (lastInvoice && lastInvoice.invoiceNumber.startsWith("INV-")) {
      const lastNumberPart = lastInvoice.invoiceNumber.split("-")[1];
      const nextNumber = parseInt(lastNumberPart) + 1;
      nextInvoiceNumber = `INV-${nextNumber.toString().padStart(3, "0")}`;
    }

    // CREATE NEW INVOICE
    return await tx.invoice.create({
      data: {
        invoiceNumber: nextInvoiceNumber,
        fromName,
        fromEmail,
        clientName,
        clientEmail,
        clientRegion,
        currency,
        subtotal,
        taxRate: Number(taxRate),
        taxLabel,
        discountAmount: Number(discountAmount),
        amountPaid: Number(amountPaid) || 0,
        totalAmount,
        notes,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        status: status,
        userId: internalUser.id,
        clientId: targetClientId,
        items: {
          create: items.map((item: InvoiceItem) => ({
            type: item.type || "Service",
            description: item.description,
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        },
      },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/clients");
  redirect("/dashboard");
}

export async function archiveInvoiceAction(invoiceId: number) {
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { isArchived: true },
  });
  revalidatePath("/dashboard");
}

export async function unarchiveInvoiceAction(invoiceId: number) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { isArchived: false },
  });
  revalidatePath("/dashboard");
}

export async function getArchivedInvoiceAction() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");
  const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
  if (!dbUser) return [];
  return await prisma.invoice.findMany({
    where: { userId: dbUser.id, isArchived: true },
    orderBy: { id: "desc" },
  });
}
