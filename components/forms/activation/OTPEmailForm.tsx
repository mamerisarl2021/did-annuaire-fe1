"use client";
import { type UseFormReturn } from "react-hook-form";
import { Mail, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import type { OTPFormData } from "@/lib/schemas/otp.schema";

interface OTPEmailFormProps {
  form: UseFormReturn<OTPFormData>;
  onSubmit: (data: OTPFormData) => void;
  onGenerateOTP: () => void;
  isGenerating?: boolean;
  isVerifying?: boolean;
  otpSent?: boolean;
  email?: string;
  className?: string;
}

/**
 * Email OTP form with generate and verify
 * Pure UI component - receives form and handlers from parent
 * Reusable for both activation and login flows
 */
export function OTPEmailForm({
  form,
  onSubmit,
  onGenerateOTP,
  isGenerating = false,
  isVerifying = false,
  otpSent = false,
  email,
  className,
}: OTPEmailFormProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Instructions */}
      <div className="space-y-2 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="size-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Vérification par email</h3>
        <p className="text-sm text-muted-foreground">
          {otpSent
            ? `Un code de vérification a été envoyé à ${email || "votre email"}`
            : "Cliquez sur le bouton pour recevoir un code par email"}
        </p>
      </div>

      {/* Generate OTP Button */}
      {!otpSent ? (
        <Button
          type="button"
          className="w-full"
          size="lg"
          onClick={onGenerateOTP}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Mail className="size-4" />
              Envoyer le code OTP
            </>
          )}
        </Button>
      ) : (
        <>
          {/* OTP Input Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp_code"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel>Code de vérification</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isVerifying}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>Entrez le code à 6 chiffres reçu par email</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={isVerifying}>
                {isVerifying ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  "Vérifier"
                )}
              </Button>
            </form>
          </Form>

          {/* Resend OTP */}
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onGenerateOTP}
              disabled={isGenerating}
            >
              <RefreshCw className={cn("size-4", isGenerating && "animate-spin")} />
              Renvoyer le code
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
