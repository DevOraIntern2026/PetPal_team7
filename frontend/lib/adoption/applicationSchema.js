import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{7,}$/, "Enter a valid phone number"),
  city: z.string().trim().min(2, "Enter your city"),
  housing: z.string().min(1, "Choose where you live"),
  hasOtherPets: z.boolean().optional(),
  reason: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters")
    .max(1000, "Please keep it under 1000 characters"),
  agree: z.boolean().refine((v) => v, "Please confirm to continue"),
});
