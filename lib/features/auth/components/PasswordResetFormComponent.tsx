"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPasswordStrengthLabel } from "@/lib/schemas/activation.schema";
import type {
  PasswordResetRequestFormData,
  PasswordResetConfirmFormData,
} from "@/lib/features/auth/schemas/password-reset.schema";

interface PasswordResetRequestProps {
  form: UseFormReturn<PasswordResetRequestFormData>;
  onSubmit: (data: PasswordResetRequestFormData) => void;
  isSubmitting?: boolean;
}

interface PasswordResetConfirmProps {
  form: UseFormReturn<PasswordResetConfirmFormData>;
  onSubmit: (data: PasswordResetConfirmFormData) => void;
  isSubmitting?: boolean;
  passwordStrength?: ReturnType<typeof getPasswordStrengthLabel>;
}

export function PasswordResetRequestForm({
  form,
  onSubmit,
  isSubmitting = false,
}: PasswordResetRequestProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Adresse email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre.email@example.com"
          disabled={isSubmitting}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours..." : "Envoyer le lien"}
      </Button>
    </form>
  );
}

export function PasswordResetConfirmForm({
  form,
  onSubmit,
  isSubmitting = false,
  passwordStrength,
}: PasswordResetConfirmProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 12 caractères"
            disabled={isSubmitting}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}

        {/* Password Strength Indicator */}
        {passwordStrength && passwordStrength.label && (
          <div className="text-sm">
            Force du mot de passe :{" "}
            <span className={passwordStrength.color}>
              {passwordStrength.label}
            </span>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Retapez votre mot de passe"
            disabled={isSubmitting}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
      </Button>
    </form>
  );
}
