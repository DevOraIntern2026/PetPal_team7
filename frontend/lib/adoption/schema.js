import { z } from "zod";

export const applySchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^\d{8,15}$/, "Enter a valid phone number"),
  city: z.string().min(1, "Choose your city"),
  housing: z.enum(["Apartment", "House", "Other"]),
  space: z.enum(["Yes", "No"]),
  petAllowed: z.enum(["Yes", "No"]),
  kidsOrPets: z.enum(["Yes", "No"]),
});

export const STEP1_FIELDS = ["fullName", "email", "phone", "city"];

export const DEFAULT_VALUES = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  housing: "Apartment",
  space: "Yes",
  petAllowed: "Yes",
  kidsOrPets: "No",
};
