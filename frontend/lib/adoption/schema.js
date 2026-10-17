import { z } from "zod";

const toNumber = (v) => (v === "" || v == null ? undefined : v);

export const listingSchema = z.object({
  petName: z.string().trim().min(1, "Pet name is required"),
  location: z.string().trim().min(1, "Location is required"),
  gender: z.enum(["Male", "Female"], { message: "Choose a gender" }),
  price: z.preprocess(
    toNumber,
    z.coerce
      .number({ message: "Enter a price (0 for free)" })
      .min(0, "Price can't be negative"),
  ),
  weightKg: z.preprocess(
    toNumber,
    z.coerce
      .number({ message: "Enter a valid weight" })
      .positive("Enter a valid weight"),
  ),
  ageInMonths: z.preprocess(
    toNumber,
    z.coerce
      .number({ message: "Enter a valid age" })
      .int("Age must be a whole number")
      .min(0, "Enter a valid age"),
  ),
  about: z.string().trim().max(1000, "Max 1000 characters").optional(),
});

export const DEFAULT_VALUES = {
  petName: "",
  location: "",
  gender: "",
  price: 0,
  weightKg: "",
  ageInMonths: "",
  about: "",
};
