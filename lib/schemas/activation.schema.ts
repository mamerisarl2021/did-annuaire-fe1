import { z } from "zod";

const passwordRequirements = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

export const passwordSchema = z
  .string()
  .min(1, "Le mot de passe est requis")
  .min(
    passwordRequirements.minLength,
    `Le mot de passe doit contenir au moins ${passwordRequirements.minLength} caractères`
  )
  .regex(passwordRequirements.hasUppercase, "Le mot de passe doit contenir au moins une majuscule")
  .regex(passwordRequirements.hasLowercase, "Le mot de passe doit contenir au moins une minuscule")
  .regex(passwordRequirements.hasNumber, "Le mot de passe doit contenir au moins un chiffre")
  .regex(
    passwordRequirements.hasSpecialChar,
    "Le mot de passe doit contenir au moins un caractère spécial"
  );

export const activationSchema = z
  .object({
    password: passwordSchema,
    password_confirm: z.string().min(1, "La confirmation du mot de passe est requise"),
    enable_totp: z.boolean(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Les mots de passe ne correspondent pas",
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
  };
} {
  const requirements = {
    minLength: password.length >= passwordRequirements.minLength,
    hasUppercase: passwordRequirements.hasUppercase.test(password),
    hasLowercase: passwordRequirements.hasLowercase.test(password),
    hasNumber: passwordRequirements.hasNumber.test(password),
    hasSpecialChar: passwordRequirements.hasSpecialChar.test(password),
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
  if (score <= 2) return { label: "Faible", color: "text-destructive" };
  if (score <= 3) return { label: "Moyen", color: "text-orange-500" };
  if (score <= 4) return { label: "Bon", color: "text-yellow-500" };
  return { label: "Excellent", color: "text-green-500" };
}
