"use client";

import { type UseFormReturn } from "react-hook-form";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, Smartphone, Copy, Check } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { type ActivateAccountFormData, type QRCodeData } from "../schemas/activate.schema";

interface ActivationFormProps {
  form: UseFormReturn<ActivateAccountFormData>;
  onSubmit: (data: ActivateAccountFormData) => void;
  isSubmitting?: boolean;
  isDisabled?: boolean;
  show2FASetup?: boolean;
  qrCodeData?: QRCodeData | null;
  is2FAVerified?: boolean;
  twoFactorError?: string | null;
  className?: string;
}

export function ActivationForm({
  form,
  onSubmit,
  isSubmitting = false,
  isDisabled = false,
  show2FASetup = false,
  qrCodeData = null,
  is2FAVerified = false,
  twoFactorError,
  className,
}: ActivationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const enableOtp = watch("enableOtp");
  const code = watch("code");

  const canSubmit = !enableOtp || !show2FASetup || code?.length === 6;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
      {/* Password Fields Section */}
      <div className="space-y-4">
        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10"
              disabled={isSubmitting || isDisabled || show2FASetup}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
              disabled={isSubmitting || isDisabled || show2FASetup}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10"
              disabled={isSubmitting || isDisabled || show2FASetup}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
              disabled={isSubmitting || isDisabled || show2FASetup}
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* 2FA Opt-in Checkbox - OBLIGATOIRE (lecture seule) */}
      <div className="flex items-center space-x-2 rounded-lg border p-4 bg-primary/5 border-primary/20">
        <Checkbox id="enableOtp" checked={true} disabled={true} />
        <div className="flex-1">
          <Label htmlFor="enableOtp" className="text-sm font-medium flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            Two-Factor Authentication (2FA) - Obligatoire
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            La 2FA est requise pour tous les comptes
          </p>
        </div>
      </div>

      {/* Conditional 2FA Setup - Toujours affiché quand on a le QR */}
      {show2FASetup && qrCodeData && (
        <TwoFactorSetupSection
          form={form}
          qrCodeData={qrCodeData}
          onSubmitAction={() => handleSubmit(onSubmit)()}
          isVerifying={isSubmitting} // Use main isSubmitting for the secondary button too
          isVerified={is2FAVerified}
          error={twoFactorError}
        />
      )}

      {/* Warning si pas encore vérifié */}
      {!is2FAVerified && !show2FASetup && (
        <p className="text-sm text-amber-600 text-center">
          Cliquez sur le bouton pour configurer la 2FA
        </p>
      )}

      {show2FASetup && !is2FAVerified && (
        <p className="text-sm text-amber-600 text-center">
          Vous devez vérifier le code OTP pour compléter l'activation
        </p>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting || isDisabled || !canSubmit}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Activation en cours...
          </>
        ) : !is2FAVerified ? (
          show2FASetup ? (
            "Compléter l'activation"
          ) : (
            "Configurer la 2FA"
          )
        ) : (
          "Activer mon compte"
        )}
      </Button>
    </form>
  );
}

function TwoFactorSetupSection({
  form,
  qrCodeData,
  onSubmitAction,
  isVerifying,
  isVerified,
  error,
}: {
  form: UseFormReturn<ActivateAccountFormData>;
  qrCodeData: QRCodeData;
  onSubmitAction: () => void;
  isVerifying: boolean;
  isVerified: boolean;
  error?: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const otpValue = form.watch("code") || "";
  const setOtpValue = (val: string) => form.setValue("code", val, { shouldValidate: true });

  const handleCopySecret = async () => {
    if (qrCodeData.secret) {
      await navigator.clipboard.writeText(qrCodeData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerify = async () => {
    if (otpValue.length !== 6) {
      setLocalError("Code must be 6 digits");
      return;
    }
    setLocalError(null);
    onSubmitAction();
  };

  if (isVerified) {
    return (
      <div className="border rounded-lg p-4 bg-green-50 text-center space-y-2">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
          <ShieldCheck className="size-6 text-green-600" />
        </div>
        <p className="font-medium text-green-700">2FA Enabled</p>
        <p className="text-xs text-green-600">
          Two-factor authentication has been configured successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-background space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10">
          <Smartphone className="size-5 text-primary" />
        </div>
        <h4 className="font-medium">Configure 2FA</h4>
        <p className="text-xs text-muted-foreground">
          Scan the QR code with your authenticator app
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        {qrCodeData.qr_code ? (
          <Image
            src={qrCodeData.qr_code}
            alt="2FA QR Code"
            width={160}
            height={160}
            className="rounded-lg border"
            unoptimized
          />
        ) : (
          <div className="flex size-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
            <p className="text-xs text-muted-foreground">QR Code unavailable</p>
          </div>
        )}
      </div>

      {/* Secret Key */}
      {qrCodeData.secret && (
        <div className="rounded-lg bg-muted/50 p-2 text-center">
          <p className="text-xs text-muted-foreground mb-1">Or enter manually:</p>
          <div className="flex items-center justify-center gap-2">
            <code className="font-mono text-xs bg-background px-2 py-1 rounded">
              {qrCodeData.secret}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCopySecret}
              className="size-7"
            >
              {copied ? (
                <Check className="size-4 text-green-600" />
              ) : (
                <Copy className="size-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* OTP Input */}
      <div className="flex flex-col items-center gap-2">
        <Label className="text-sm">Verification Code</Label>
        <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue} disabled={isVerifying}>
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
        {(localError || error) && <p className="text-xs text-destructive">{localError || error}</p>}
      </div>

      {/* Verify Button */}
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={handleVerify}
        disabled={isVerifying || otpValue.length !== 6}
      >
        {isVerifying ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Code"
        )}
      </Button>
    </div>
  );
}
