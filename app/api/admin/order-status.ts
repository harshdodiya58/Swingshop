import { z } from "zod";

export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "CRAFTING",
  "QUALITY_CHECK",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
]);