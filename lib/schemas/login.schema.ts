import { z } from "zod";
import { passwordRequirements } from "./activation.schema";
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(passwordRequirements.minLength, "Password must contain at least 12 characters")
    .regex(passwordRequirements.hasUppercase, "Password must contain at least one uppercase letter")
    .regex(passwordRequirements.hasLowercase, "Password must contain at least one lowercase letter")
    .regex(passwordRequirements.hasNumber, "Password must contain at least one number")
    .regex(passwordRequirements.hasSpecialChar, "Password must contain at least one special character")
    .regex(passwordRequirements.NoSpace, "Password must not contain spaces"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
