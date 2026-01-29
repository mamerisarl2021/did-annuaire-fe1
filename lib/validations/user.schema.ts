import * as z from "zod";

export const userCreateSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is too long")
    .regex(/^[+]?[\d\s\-()]+$/, "Please enter a valid phone number"),
  functions: z.string().optional(),
  can_publish_prod: z.boolean(),
  is_auditor: z.boolean(),
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z.object({
  email: z.string().email("Please enter a valid email address").optional(),
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters")
    .optional(),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters")
    .optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is too long")
    .regex(/^[+]?[\d\s\-()]+$/, "Please enter a valid phone number")
    .optional(),
  functions: z.string().optional(),
  can_publish_prod: z.boolean().optional(),
  is_auditor: z.boolean().optional(),
});

export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
