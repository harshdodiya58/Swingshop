import { z } from "zod";

const phoneRegex = /^[6-9]\d{9}$/;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a valid 10-digit Indian mobile number")
    .optional()
    .or(z.literal("")),
  product: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const customOrderSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email().max(120),
  swingType: z.string().trim().min(2).max(120),
  size: z.string().trim().max(60).optional().or(z.literal("")),
  material: z.string().trim().max(60).optional().or(z.literal("")),
  finish: z.string().trim().max(60).optional().or(z.literal("")),
  color: z.string().trim().max(60).optional().or(z.literal("")),
  budget: z.coerce.number().int().positive().max(50_000_000).optional(),
  description: z.string().trim().min(10).max(3000),
  referenceImages: z.array(z.string().url()).max(5).default([]),
});
export type CustomOrderInput = z.infer<typeof customOrderSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(120),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const addressSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid 10-digit Indian mobile number"),
  line1: z.string().trim().min(4).max(160),
  line2: z.string().trim().max(160).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pin: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN"),
  country: z.string().trim().max(80).default("India"),
  isDefault: z.boolean().default(false),
});
export type AddressInput = z.infer<typeof addressSchema>;

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().min(5).max(2000).optional(),
});
export type ReviewInput = z.infer<typeof reviewSchema>;