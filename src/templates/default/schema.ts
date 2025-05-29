import { z } from "zod/v4";

const currencies = ["USD", "EUR", "RSD"] as const;
export type Currency = (typeof currencies)[number];

export const symbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  RSD: "RSD",
};

export const productSchema = z.object({
  unique_id: z.union([z.string().regex(/[A-Z][a-z][0-9]/), z.number()]),
  title: z.string(),
  with_free_shipping: z.boolean().default(false),
  free_shipping_badge_text: z.string().optional(),
  currency: z.enum(currencies).default("EUR"),
  price: z.number(),
  discount_price: z.number().optional(),
  image: z.url(),
  description: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;
