import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#FFFFFF", fontFamily: "Helvetica" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  section: { marginBottom: 20 },
  label: {
    fontSize: 10,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  addressText: { fontSize: 12, color: "#0f172a", marginBottom: 2 },

  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingVertical: 8,
  },
  tableHeader: { backgroundColor: "#f8fafc", fontWeight: "bold" },

  col6: { width: "50%" },
  col2: { width: "16.6%" },
  textRight: { textAlign: "right" },
  textCenter: { textAlign: "center" },
  itemText: { fontSize: 10, color: "#334155" },

  totalsSection: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalsBox: { width: 150 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  grandTotal: {
    borderTopWidth: 2,
    borderTopColor: "#000",
    paddingTop: 8,
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export const InvoicePDF = ({ invoice }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Top */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{invoice.invoiceNumber}</Text>
          <Text style={{ fontSize: 10, color: "#64748b" }}>
            Issued: {new Date(invoice.issueDate).toDateString()}
          </Text>
        </View>
        <Text style={{ fontSize: 12, fontWeight: "bold", color: "#2563eb" }}>
          PAID
        </Text>
      </View>

      {/* Address */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 40,
        }}
      >
        <View>
          <Text style={styles.label}>Billed From</Text>
          <Text style={styles.addressText}>{invoice.fromName}</Text>
          <Text style={styles.addressText}>{invoice.fromEmail}</Text>
        </View>
        <View style={styles.textRight}>
          <Text style={styles.label}>Billed To</Text>
          <Text style={styles.addressText}>{invoice.clientName}</Text>
          <Text style={styles.addressText}>{invoice.clientEmail}</Text>
        </View>
      </View>

      {/* ITems table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.col6, styles.itemText, { fontWeight: "bold" }]}>
            Description
          </Text>
          <Text style={[styles.col2, styles.textCenter, styles.itemText]}>
            Qty
          </Text>
          <Text style={[styles.col2, styles.textRight, styles.itemText]}>
            Price
          </Text>
          <Text style={[styles.col2, styles.textRight, styles.itemText]}>
            Total
          </Text>
        </View>

        {invoice.items.map((item: any) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.col6, styles.itemText]}>
              {item.description}
            </Text>
            <Text style={[styles.col2, styles.textCenter, styles.itemText]}>
              {item.quantity}
            </Text>
            <Text style={[styles.col2, styles.textRight, styles.itemText]}>
              ₹{item.price}
            </Text>
            <Text
              style={[
                styles.col2,
                styles.textRight,
                styles.itemText,
                { fontWeight: "bold" },
              ]}
            >
              ₹{item.quantity * item.price}
            </Text>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={styles.totalsSection}>
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.itemText}>Subtotal:</Text>
            <Text style={styles.itemText}>₹{invoice.subtotal}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.itemText}>GST (18%):</Text>
            <Text style={styles.itemText}>₹{invoice.taxAmount}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={{ fontSize: 14 }}>Total:</Text>
            <Text style={{ fontSize: 14 }}>₹{invoice.totalAmount}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
