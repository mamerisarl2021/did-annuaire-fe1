import { z } from "zod";
import { passwordSchema } from "@/lib/schemas/activation.schema";

export const passwordResetRequestSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

export const passwordResetConfirmSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordResetRequestFormData = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmFormData = z.infer<typeof passwordResetConfirmSchema>;
