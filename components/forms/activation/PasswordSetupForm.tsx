"use client";

import * as React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  type ActivationFormData,
  getPasswordStrength,
  getPasswordStrengthLabel,
} from "@/lib/schemas/activation.schema";

interface PasswordSetupFormProps {
  form: UseFormReturn<ActivationFormData>;
  onSubmit: (data: ActivationFormData) => void;
  isSubmitting?: boolean;
  className?: string;
}

/**
 * Password setup form for account activation
 * Pure UI component - receives form and handlers from parent
 */
export function PasswordSetupForm({
  form,
  onSubmit,
  isSubmitting = false,
  className,
}: PasswordSetupFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const password = form.watch("password");
  const { score, requirements } = getPasswordStrength(password || "");
  const strengthLabel = getPasswordStrengthLabel(score);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    disabled={isSubmitting}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            "h-1 flex-1 rounded-full",
                            score >= level ? "bg-primary" : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                    <span className={cn("text-xs font-medium", strengthLabel.color)}>
                      {strengthLabel.label}
                    </span>
                  </div>

                  {/* Requirements checklist */}
                  <ul className="grid grid-cols-2 gap-1 text-xs">
                    <li
                      className={cn(
                        "flex items-center gap-1",
                        requirements.minLength ? "text-green-600" : "text-muted-foreground"
                      )}
                    >
                      {requirements.minLength ? (
                        <Check className="size-3" />
                      ) : (
                        <X className="size-3" />
                      )}
                      8 caractères min.
                    </li>
                    <li
                      className={cn(
                        "flex items-center gap-1",
                        requirements.hasUppercase ? "text-green-600" : "text-muted-foreground"
                      )}
                    >
                      {requirements.hasUppercase ? (
                        <Check className="size-3" />
                      ) : (
                        <X className="size-3" />
                      )}
                      Majuscule
                    </li>
                    <li
                      className={cn(
                        "flex items-center gap-1",
                        requirements.hasLowercase ? "text-green-600" : "text-muted-foreground"
                      )}
                    >
                      {requirements.hasLowercase ? (
                        <Check className="size-3" />
                      ) : (
                        <X className="size-3" />
                      )}
                      Minuscule
                    </li>
                    <li
                      className={cn(
                        "flex items-center gap-1",
                        requirements.hasNumber ? "text-green-600" : "text-muted-foreground"
                      )}
                    >
                      {requirements.hasNumber ? (
                        <Check className="size-3" />
                      ) : (
                        <X className="size-3" />
                      )}
                      Chiffre
                    </li>
                    <li
                      className={cn(
                        "flex items-center gap-1",
                        requirements.hasSpecialChar ? "text-green-600" : "text-muted-foreground"
                      )}
                    >
                      {requirements.hasSpecialChar ? (
                        <Check className="size-3" />
                      ) : (
                        <X className="size-3" />
                      )}
                      Caractère spécial
                    </li>
                  </ul>
                </div>
              )}
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="password_confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le mot de passe *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    disabled={isSubmitting}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Enable TOTP Checkbox */}
        <FormField
          control={form.control}
          name="enable_totp"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer">
                  Activer la double authentification (OTP)
                </FormLabel>
                <FormDescription>
                  Sécurisez votre compte avec une application d&apos;authentification (recommandé)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          Activer mon compte
        </Button>
      </form>
    </Form>
  );
}
