import { z } from "zod";

/**
 * Schema for account activation form
 * Validates password requirements and confirmation match
 */
export const activateAccountSchema = z
  .object({
    password: z
      .string()
      .min(12, "Password must contain at least 12 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
    enableOtp: z.boolean(),
    code: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ActivateAccountFormData = z.infer<typeof activateAccountSchema>;

/**
 * Activation flow step types
 */
export const ActivationFlowStep = {
  PASSWORD: "PASSWORD",
  OTP_SETUP: "OTP_SETUP",
  SUCCESS: "SUCCESS",
} as const;

export type ActivationFlowStepType = (typeof ActivationFlowStep)[keyof typeof ActivationFlowStep];

/**
 * QR Code data returned after activation with OTP enabled
 */
export interface QRCodeData {
  qr_code?: string;
  secret?: string;
}
