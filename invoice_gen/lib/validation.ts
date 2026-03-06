import z from "zod";

export const invoiceSchema = z.object({
  clientId: z.number().optional(),
  clientName: z.string().min(2).optional(),

  invoiceNumber: z.string().min(1),
  issueDate: z.coerce.date(),

  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().min(1),
        price: z.number().min(1),
      }),
    )
    .min(1),
});
