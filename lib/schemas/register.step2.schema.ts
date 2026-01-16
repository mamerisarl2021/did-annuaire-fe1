import { z } from "zod";

export const registerStep2Schema = z.object({
  admin_email: z.email("Invalid email format").min(1, "Admin email is required"),

  admin_first_name: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must contain at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  admin_last_name: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must contain at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),

  admin_phone: z
    .string()
    .min(1, "Phone number is required")
    .min(8, "Phone number must contain at least 8 digits"),

  functions: z
    .string()
    .min(1, "Role is required")
    .min(2, "Role must contain at least 2 characters")
    .max(100, "Role cannot exceed 100 characters"),
});

/**
 * Inferred type from step 2 schema
 */
export type RegisterStep2Data = z.infer<typeof registerStep2Schema>;
