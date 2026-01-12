import { z } from "zod";

/**
 * OTP code validation (6 digits)
 */
export const otpSchema = z.object({
  otp_code: z
    .string()
    .min(1, "OTP code is required")
    .length(6, "OTP code must contain 6 digits")
    .regex(/^\d{6}$/, "OTP code must contain only numbers"),
});

export type OTPFormData = z.infer<typeof otpSchema>;
