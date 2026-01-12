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
  /** Form instance from react-hook-form */
  form: UseFormReturn<ActivateAccountFormData>;
  /** Submit handler for password setup */
  onSubmit: (data: ActivateAccountFormData) => void;
  /** Whether form is submitting */
  isSubmitting?: boolean;
  /** Whether form should be disabled (e.g., invalid token) */
  isDisabled?: boolean;
  /** Whether 2FA setup is required (checkbox checked) */
  show2FASetup?: boolean;
  /** QR code data for 2FA setup */
  qrCodeData?: QRCodeData | null;
  /** Handler for 2FA verification */
  onVerify2FA?: (code: string) => Promise<boolean>;
  /** Whether 2FA verification is in progress */
  isVerifying2FA?: boolean;
  /** Whether 2FA has been verified */
  is2FAVerified?: boolean;
  /** 2FA error message */
  twoFactorError?: string | null;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Unified Activation Form Component
 *
 * Single Responsibility: Render activation form UI
 * - Password and confirmation fields
 * - OTP opt-in checkbox
 * - Conditional 2FA setup form when checkbox is checked and QR received
 * - Submit button blocked until 2FA verified (if enabled)
 */
export function ActivationForm({
  form,
  onSubmit,
  isSubmitting = false,
  isDisabled = false,
  show2FASetup = false,
  qrCodeData = null,
  onVerify2FA,
  isVerifying2FA = false,
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

  // Block submit if OTP is enabled but not verified
  const canSubmit = !enableOtp || (enableOtp && is2FAVerified);

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
              disabled={isSubmitting || isDisabled}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
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
              disabled={isSubmitting || isDisabled}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* 2FA Opt-in Checkbox */}
      <div className="flex items-center space-x-2 rounded-lg border p-4 bg-muted/30">
        <Checkbox
          id="enableOtp"
          checked={enableOtp}
          onCheckedChange={(checked) => setValue("enableOtp", checked === true)}
          disabled={isSubmitting || isDisabled}
        />
        <div className="flex-1">
          <Label
            htmlFor="enableOtp"
            className="text-sm font-medium cursor-pointer flex items-center gap-2"
          >
            <ShieldCheck className="size-4 text-primary" />
            Enable Two-Factor Authentication (2FA)
          </Label>
          <p className="text-xs text-muted-foreground mt-1">Recommended for enhanced security</p>
        </div>
      </div>

      {/* Conditional 2FA Setup - Shown when checkbox is checked AND we have QR data */}
      {show2FASetup && qrCodeData && onVerify2FA && (
        <TwoFactorSetupSection
          qrCodeData={qrCodeData}
          onVerify={onVerify2FA}
          isVerifying={isVerifying2FA}
          isVerified={is2FAVerified}
          error={twoFactorError}
        />
      )}

      {/* Warning if OTP enabled but not verified */}
      {enableOtp && !is2FAVerified && !show2FASetup && (
        <p className="text-sm text-amber-600 text-center">Click Enable to set up 2FA</p>
      )}

      {enableOtp && show2FASetup && !is2FAVerified && (
        <p className="text-sm text-amber-600 text-center">
          You must verify the OTP code to complete activation
        </p>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting || isDisabled || !canSubmit}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Activation in progress...
          </>
        ) : enableOtp && !is2FAVerified ? (
          show2FASetup ? (
            "Complete activation"
          ) : (
            "Setup 2FA"
          )
        ) : (
          "Activate my account"
        )}
      </Button>
    </form>
  );
}

/**
 * Inline 2FA Setup Section
 * Displays QR code and OTP verification input
 */
function TwoFactorSetupSection({
  qrCodeData,
  onVerify,
  isVerifying,
  isVerified,
  error,
}: {
  qrCodeData: QRCodeData;
  onVerify: (code: string) => Promise<boolean>;
  isVerifying: boolean;
  isVerified: boolean;
  error?: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

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
    const success = await onVerify(otpValue);
    if (!success) {
      setOtpValue("");
    }
  };

  // Show success state
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
            <button type="button" onClick={handleCopySecret} className="p-1">
              {copied ? (
                <Check className="size-3 text-green-600" />
              ) : (
                <Copy className="size-3 text-muted-foreground" />
              )}
            </button>
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
