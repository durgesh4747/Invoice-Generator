import GenerateInvoice from "@/components/OnLoginComponents/InvoiceForm";
import { getClientsAction } from "@/app/actions/clients";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

type Params = Promise<{ id: string }>;

export default async function EditInvoicePage({ params }: { params: Params }) {
  const { id } = await params;
  const invoiceId = Number(id);

  if (isNaN(invoiceId)) return notFound();

  const user = await currentUser();

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: true },
  });

  if (!invoice) return notFound();

  const savedClients = await getClientsAction();
  const userData = {
    name:
      `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Guest User",
    email: user?.emailAddresses[0]?.emailAddress ?? "",
  };
  return (
    <GenerateInvoice
      userData={userData}
      savedClients={savedClients}
      initialData={invoice}
    />  
  );
}
