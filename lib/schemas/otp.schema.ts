import { z } from "zod";

/**
 * OTP code validation (6 digits)
 */
export const otpSchema = z.object({
  otp_code: z
    .string()
    .min(1, "Le code OTP est requis")
    .length(6, "Le code OTP doit contenir 6 chiffres")
    .regex(/^\d{6}$/, "Le code OTP doit contenir uniquement des chiffres"),
});

export type OTPFormData = z.infer<typeof otpSchema>;
