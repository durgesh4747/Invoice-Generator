import getCurrentUser from "./getcurrentUser";
import prisma from "./prisma";

export default async function getInvoicesForDashboard() {
  const user = await getCurrentUser();
  return prisma.invoice.findMany({
    where: {
      userId: user.id,
      isArchived:false,
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: true,
    },
  });
}
