import { z } from "zod";

const email = z
  .string()
  .min(1, "Enter your email")
  .email("Enter a valid email");

const password = z
  .string()
  .min(8, "Use at least 8 characters")
  .regex(/\d/, "Include at least one number");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().optional(),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email,
  password,
  terms: z.boolean().refine((v) => v, "Please accept the terms to continue"),
});

export const forgotSchema = z.object({ email });

export const resetSchema = z.object({
  email,
  code: z.string().trim().min(1, "Enter the code from your email"),
  newPassword: password,
});
