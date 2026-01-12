"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

interface OTPFormProps {
  /** Handler called when OTP is submitted */
  onSubmit: (code: string) => void;
  /** Handler for going back to login */
  onBack?: () => void;
  /** Whether verification is in progress */
  isVerifying?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Description text */
  description?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Pure UI component for OTP verification during login
 *
 * Single Responsibility: Display OTP input form
 * - Collects 6-digit OTP code
 * - Delegates submission to parent
 * - Shows error messages
 */
export function OTPForm({
  onSubmit,
  onBack,
  isVerifying = false,
  error,
  description = "Please enter the 6-digit code from your authenticator app.",
  className,
}: OTPFormProps) {
  const [otpValue, setOtpValue] = useState("");

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length === 6) {
      onSubmit(otpValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <InputOTP maxLength={6} value={otpValue} onChange={handleOtpChange} disabled={isVerifying}>
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

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isVerifying || otpValue.length !== 6}>
        {isVerifying ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Verification...
          </>
        ) : (
          "Verify Code"
        )}
      </Button>

      {onBack && (
        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to Login
          </button>
        </div>
      )}
    </form>
  );
}
