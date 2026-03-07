"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createInvoiceAction(formData: any) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // Server-Side Calculations
  const GST_RATE = 0.18;
  const subtotal = formData.items.reduce((sum: number, item: any) => {
    return sum + Number(item.quantity) * Number(item.price);
  }, 0);

  const taxAmount = subtotal * GST_RATE;
  const totalAmount = subtotal + taxAmount;

  // Database Transaction
  const invoice = await prisma.$transaction(async (tx) => {
    let dbUser = await tx.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      dbUser = await tx.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: user.fullName || "Valued User",
        },
      });
    }

    const internalUserId = dbUser.id;

    // Ensure Client exists or create new one
    let client = await tx.client.findFirst({
      where: {
        email: formData.clientEmail,
        userId: internalUserId, 
      },
    });

    if (!client) {
      client = await tx.client.create({
        data: {
          name: formData.clientName,
          email: formData.clientEmail,
          userId: internalUserId,
        },
      });
    }

    // Create Invoice with Snapshots
    return await tx.invoice.create({
      data: {
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        fromName: formData.fromName,
        fromEmail: formData.fromEmail,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        subtotal,
        taxAmount,
        totalAmount,
        issueDate: new Date(formData.issueDate),
        userId: internalUserId,
        clientId: client.id,
        items: {
          create: formData.items.map((item: any) => ({
            type:item.type,
            description: item.description,
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        },
      },
    });
  });
  redirect(`/dashboard`);
}
