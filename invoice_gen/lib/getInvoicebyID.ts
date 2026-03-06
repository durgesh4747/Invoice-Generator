import prisma from "./prisma";
import getCurrentUser from "./getcurrentUser";

// import { Prisma } from "@/app/generated/prisma/client";
// export type InvoiceWithClientAndItems = Prisma.InvoiceGetPayload<{
//   include: {
//     client: true;
//     items: true;
//   };
// }>;

export default async function getInvoicebyID(id: number) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User doesn't exist");
  }
  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: {
      client: true,
      items: true,
    },
  });
  if (!invoice) {
    throw new Error("Invoice doesn't exist!");
  }
  return invoice;
}
