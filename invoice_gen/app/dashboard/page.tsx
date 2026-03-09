import DashboardUI from "@/components/OnLoginComponents/Dashboard";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser) return null;

  const [activeInvoices, archivedInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId: dbUser.id, isArchived: false },
      include: { client: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.invoice.findMany({
      where: { userId: dbUser.id, isArchived: true },
      include: { client: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <DashboardUI
      invoices={activeInvoices}
      archivedInvoices={archivedInvoices}
    />
  );
}
