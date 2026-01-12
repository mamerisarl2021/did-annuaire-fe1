"use client";

import { type UseFormReturn } from "react-hook-form";
import { Smartphone, Loader2 } from "lucide-react";
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

interface TOTPSetupFormProps {
  form: UseFormReturn<OTPFormData>;
  onSubmit: (data: OTPFormData) => void;
  isVerifying?: boolean;
  qrCodeUrl?: string;
  secretKey?: string;
  className?: string;
}

/**
 * TOTP setup form with QR code and OTP input
 * Pure UI component - receives form and handlers from parent
 */
export function TOTPSetupForm({
  form,
  onSubmit,
  isVerifying = false,
  className,
}: TOTPSetupFormProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Instructions */}
      <div className="space-y-2 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Smartphone className="size-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">
          Configurer l&apos;authentification à deux facteurs
        </h3>
        <p className="text-sm text-muted-foreground">
          Scannez le QR code avec votre application d&apos;authentification (Google Authenticator,
          Authy, etc.)
        </p>
      </div>

      {/* QR Code Placeholder */}
      <div className="flex justify-center">
        <div className="flex size-48 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50">
          <div className="text-center">
            <div className="text-4xl">📱</div>
            <p className="mt-2 text-xs text-muted-foreground">
              QR Code
              <br />
              (généré par l&apos;API)
            </p>
          </div>
        </div>
      </div>

      {/* Secret Key Display (for manual entry) */}
      <div className="rounded-lg bg-muted/50 p-3 text-center">
        <p className="text-xs text-muted-foreground mb-1">Ou entrez ce code manuellement :</p>
        <code className="font-mono text-sm tracking-widest">XXXX-XXXX-XXXX-XXXX</code>
      </div>

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
                <FormDescription>Entrez le code à 6 chiffres de votre application</FormDescription>
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
              "Vérifier et activer"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
