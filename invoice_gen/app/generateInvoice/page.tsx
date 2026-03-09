import GenerateInvoice from "@/components/OnLoginComponents/InvoiceForm";
import { getClientsAction } from "../actions/clients";
import { currentUser } from "@clerk/nextjs/server";

export default async function page() {
  const user = await currentUser();
  const savedClients = await getClientsAction();
  const userData = {
    name:
      `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Guest User",
    email: user?.emailAddresses[0]?.emailAddress ?? "",
  };
  return <GenerateInvoice userData={userData} savedClients={savedClients} />;
}
