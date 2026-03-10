import { InvoiceItem, InvoicePayload } from "@/types";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

interface UserProfile {
  fullName: string;
  primaryEmail: string;
}

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#FFFFFF", fontFamily: "Helvetica" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#0f172a",
    paddingBottom: 15,
  },
  invoiceNumber: { fontSize: 24, fontWeight: "bold", color: "#0f172a" },

  addressSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  addressBox: { width: "45%" },
  label: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 6,
    fontWeight: "bold",
  },
  addressText: { fontSize: 10, color: "#0f172a", marginBottom: 3 },
  boldText: { fontWeight: "bold", fontSize: 11 },

  table: { marginTop: 10 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    alignItems: "center",
  },

  colType: { width: "15%", textAlign: "left" },
  colDesc: { width: "40%" },
  colQty: { width: "10%", textAlign: "center" },
  colPrice: { width: "15%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },

  headerText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  cellText: { fontSize: 9, color: "#334155" },

  typeTag: {
    fontSize: 7,
    color: "#475569",
    textTransform: "uppercase",
    fontWeight: "bold",
  },

  summarySection: {
    marginTop: 30,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  totalsBox: { width: "40%" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    alignItems: "center",
  },
  grandTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#0f172a",
  },
  totalLabel: { fontSize: 9, color: "#64748b" },
  totalValue: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
  grandTotalLabel: { fontSize: 11, fontWeight: "bold", color: "#0f172a" },
  grandTotalValue: { fontSize: 16, fontWeight: "bold", color: "#0f172a" },

  statusWrapper: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  statusBadge: {
    fontSize: 9,
    padding: "6 12",
    borderRadius: 5,
    textTransform: "uppercase",
    fontWeight: "bold",
    borderWidth: 1,
  },

  notesSection: {
    marginTop: 50,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 15,
  },
});

export const InvoicePDF = ({
  invoice,
  user,
}: {
  invoice: InvoicePayload;
  user: UserProfile;
}) => {
  const formatAmount = (amount: number) => {
    return Number(amount).toFixed(2);
  };

  const getSymbol = (code: string) => {
    switch (code) {
      case "USD":
        return "$";
      case "GBP":
        return "£";
      case "EUR":
        return "€";
      case "INR":
        return "Rs.";
      default:
        return "";
    }
  };

  const symbol = getSymbol(invoice.currency);
  const taxAmount =
    (Number(invoice.subtotal) - Number(invoice.discountAmount)) *
    (Number(invoice.taxRate) / 100);
  const amountPaid = Number(invoice.amountPaid) || 0;
  const balanceDue = Number(invoice.totalAmount) - amountPaid;

  return (
    <Document title={`INVOICE - ${invoice.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
            <Text style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>
              Issued: {new Date(invoice.issueDate).toDateString()}
            </Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#0f172a" }}
            >
              INVOICE
            </Text>
            <Text style={{ fontSize: 9, color: "#64748b", marginTop: 4 }}>
              Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.addressSection}>
          <View style={styles.addressBox}>
            <Text style={styles.label}>Billed From</Text>
            <Text style={[styles.addressText, styles.boldText]}>
              {invoice.fromName || user.fullName}
            </Text>
            <Text style={styles.addressText}>
              {invoice.fromEmail || user.primaryEmail}
            </Text>
          </View>
          <View style={[styles.addressBox, { textAlign: "right" }]}>
            <Text style={styles.label}>Billed To</Text>
            <Text style={[styles.addressText, styles.boldText]}>
              {invoice.clientName}
            </Text>
            <Text style={styles.addressText}>{invoice.clientEmail}</Text>
            {invoice.clientRegion && (
              <Text
                style={[styles.addressText, { fontSize: 8, color: "#94a3b8" }]}
              >
                {invoice.clientRegion}
              </Text>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colType, styles.headerText]}>Type</Text>
            <Text style={[styles.colDesc, styles.headerText]}>Description</Text>
            <Text style={[styles.colQty, styles.headerText]}>Qty</Text>
            <Text style={[styles.colPrice, styles.headerText]}>Price</Text>
            <Text style={[styles.colTotal, styles.headerText]}>Total</Text>
          </View>

          {invoice.items.map((item: InvoiceItem, index: number) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.colType}>
                <Text style={styles.typeTag}>{item.type}</Text>
              </View>
              <Text style={[styles.colDesc, styles.cellText]}>
                {item.description}
              </Text>
              <Text style={[styles.colQty, styles.cellText]}>
                {item.quantity}
              </Text>
              <View
                style={[
                  styles.colPrice,
                  { flexDirection: "row", justifyContent: "flex-end" },
                ]}
              >
                <Text style={styles.cellText}>{symbol}</Text>
                <Text style={styles.cellText}>
                  {" "}
                  {formatAmount(Number(item.price))}
                </Text>
              </View>
              <View
                style={[
                  styles.colTotal,
                  { flexDirection: "row", justifyContent: "flex-end" },
                ]}
              >
                <Text style={styles.cellText}>{symbol}</Text>
                <Text style={styles.cellText}>
                  {" "}
                  {formatAmount(Number(item.quantity) * Number(item.price))}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals & Status Section */}
        <View style={styles.summarySection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.totalValue}>{symbol}</Text>
                <Text style={styles.totalValue}>
                  {" "}
                  {formatAmount(Number(invoice.subtotal))}
                </Text>
              </View>
            </View>

            {Number(invoice.discountAmount) > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.totalValue}>{symbol}</Text>
                  <Text style={styles.totalValue}>
                    {" "}
                    {formatAmount(Number(invoice.discountAmount))}
                  </Text>
                </View>
              </View>
            )}

            {Number(invoice.taxRate) > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  {invoice.taxLabel} ({invoice.taxRate}%)
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.totalValue}>{symbol}</Text>
                  <Text style={styles.totalValue}>
                    {" "}
                    {formatAmount(taxAmount)}
                  </Text>
                </View>
              </View>
            )}

            <View
              style={[
                styles.totalRow,
                styles.grandTotal,
                {
                  borderTopColor: "#f1f5f9",
                  borderTopWidth: 1,
                  paddingTop: 6,
                  marginTop: 4,
                },
              ]}
            >
              <Text style={styles.totalLabel}>Grand Total</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.totalValue}>{symbol}</Text>
                <Text style={styles.totalValue}>
                  {" "}
                  {formatAmount(Number(invoice.totalAmount))}
                </Text>
              </View>
            </View>

            <View style={[styles.totalRow, { marginTop: 2 }]}>
              <Text style={styles.totalLabel}>Amount Paid</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.totalValue}>{symbol}</Text>
                <Text style={styles.totalValue}>
                  {" "}
                  {formatAmount(amountPaid)}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.totalRow,
                {
                  marginTop: 8,
                  paddingTop: 8,
                  borderTopWidth: 1,
                  borderTopColor: "#0f172a",
                },
              ]}
            >
              <Text style={[styles.grandTotalLabel, { fontSize: 10 }]}>
                Balance Due
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    styles.grandTotalValue,
                    {
                      fontSize: 13,
                    },
                  ]}
                >
                  {symbol}
                </Text>
                <Text
                  style={[
                    styles.grandTotalValue,
                    {
                      fontSize: 13,
                    },
                  ]}
                >
                  {" "}
                  {formatAmount(balanceDue)}
                </Text>
              </View>
            </View>

            <View style={[styles.statusWrapper, { marginTop: 12 }]}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      invoice.status === "PAID" ? "#ecfdf5" : "#f8fafc",
                    color: invoice.status === "PAID" ? "#065f46" : "#475569",
                    borderColor:
                      invoice.status === "PAID" ? "#10b981" : "#e2e8f0",
                    paddingHorizontal: 12,
                    paddingVertical: 3,
                  },
                ]}
              >
                <Text style={{ fontSize: 7, letterSpacing: 0.5 }}>
                  {invoice.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.label}>Notes & Payment Terms</Text>
            <Text
              style={{
                fontSize: 9,
                color: "#475569",
                lineHeight: 1.6,
                marginTop: 4,
              }}
            >
              {invoice.notes}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
