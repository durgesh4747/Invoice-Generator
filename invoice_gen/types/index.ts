// Invoice Actions
export interface InvoiceItem {
  id?: number;
  type: string;
  description: string;
  quantity: string | number;
  price: string | number;
}
// Invoice Payloasd
export interface InvoicePayload {
  id?: number;
  invoiceNumber: string;
  items: InvoiceItem[];
  fromName: string | null;
  fromEmail: string | null;
  clientName: string | null;
  clientEmail: string | null;
  clientRegion?: string | null;
  currency: string;
  taxRate: number;
  taxLabel: string;
  discountAmount: number;
  amountPaid: number;
  totalAmount: number;
  subtotal: number;
  notes?: string | null;
  issueDate: Date | string;
  dueDate: Date | string;
  status: "PAID" | "PENDING" | string;
  clientId?: number | null;
}

// Client Actions
export interface ClientData {
  id: number;
  name: string;
  email: string;
  country: string;
  invoiceCurrency: string;
  totalBilled: number;
  invoiceCount: number;
}

export interface SavedClient {
  id: number;
  name: string | null; 
  email: string | null; 
  country: string | null;
  totalBilled: number;
  invoiceCurrency: string;
  invoiceCount: number;
}

export interface ClientPayload {
  name: string;
  email: string;
  country?: string;
  invoiceCurrency?: string;
}
