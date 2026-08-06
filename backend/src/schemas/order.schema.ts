import { z } from "zod";

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),
  items: z
    .array(
      z.object({
        menuItemId: z.number().int().positive(),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      })
    )
    .min(1, "Order must contain at least one item"),
});

export const updateStatusSchema = z.object({
  status: z.enum(["ORDER_RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
