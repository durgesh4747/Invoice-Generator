"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getStatsNow(targetCurrency: string = "USD") {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { totalRevenue: 0, totalInvoices: 0, totalClients: 0 };

  const dbUser = await prisma.user.findUnique({ where: { clerkId } });
  if (!dbUser) return { totalRevenue: 0, totalInvoices: 0, totalClients: 0 };

  const [invoices, clientCount] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId: dbUser.id, isArchived: false },
      select: { amountPaid: true, currency: true },
    }),
    prisma.client.count({
      where: { userId: dbUser.id, isArchived: false },
    }),
  ]);

  let totalRevenue = 0;
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${targetCurrency}`,
      { cache: "no-store" },
    );
    const data = await response.json();

    if (data.result === "success") {
      const rates = data.conversion_rates;

      totalRevenue = invoices.reduce((sum, inv) => {
        const rateToTarget = rates[inv.currency.toUpperCase()] || 1;
        const convertedPaid = (inv.amountPaid || 0) / rateToTarget;
        return sum + convertedPaid;
      }, 0);
    }
  } catch (error) {
    console.error("❌ Stats API Failed:", error);
    totalRevenue = invoices.reduce(
      (sum, inv) => sum + (inv.amountPaid || 0),
      0,
    );
  }

  return {
    totalRevenue: Math.round(totalRevenue),
    totalInvoices: invoices.length,
    totalClients: clientCount,
  };
}
