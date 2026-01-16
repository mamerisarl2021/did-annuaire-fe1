import { z } from "zod";

export const passwordRequirements = {
  minLength: 12,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  NoSpace: /^(?!\s).+$/,
};

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(
    passwordRequirements.minLength,
    `Password must contain at least ${passwordRequirements.minLength} characters`
  )
  .regex(passwordRequirements.hasUppercase, "Password must contain at least one uppercase letter")
  .regex(passwordRequirements.hasLowercase, "Password must contain at least one lowercase letter")
  .regex(passwordRequirements.hasNumber, "Password must contain at least one number")
  .regex(
    passwordRequirements.hasSpecialChar,
    "Password must contain at least one special character"
  )
  .regex(passwordRequirements.NoSpace, "Password must not contain spaces");

export const activationSchema = z
  .object({
    password: passwordSchema,
    password_confirm: z.string().min(1, "Confirm password is required"),
    enable_totp: z.boolean(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });

export type ActivationFormData = z.infer<typeof activationSchema>;

export function getPasswordStrength(password: string): {
  score: number;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    NoSpace: boolean;
  };
} {
  const requirements = {
    minLength: password.length >= passwordRequirements.minLength,
    hasUppercase: passwordRequirements.hasUppercase.test(password),
    hasLowercase: passwordRequirements.hasLowercase.test(password),
    hasNumber: passwordRequirements.hasNumber.test(password),
    hasSpecialChar: passwordRequirements.hasSpecialChar.test(password),
    NoSpace: passwordRequirements.NoSpace.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;

  return { score, requirements };
}

/**
 * Password strength labels
 */
export function getPasswordStrengthLabel(score: number): {
  label: string;
  color: string;
} {
  if (score === 0) return { label: "", color: "" };
  if (score <= 2) return { label: "Weak", color: "text-destructive" };
  if (score <= 3) return { label: "Medium", color: "text-orange-500" };
  if (score <= 4) return { label: "Good", color: "text-yellow-500" };
  return { label: "Excellent", color: "text-green-500" };
}
