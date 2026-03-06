import DashboardUI from "@/components/OnLoginComponents/Dashboard";
import getInvoicesForDashboard from "@/lib/getInvoiceForDashboard";

export default async function page() {
  const invoices = await getInvoicesForDashboard();
  if (!invoices) {
    return <p>No Invoices Yet!</p>;
  }
  return <DashboardUI invoices={invoices} />;
}
