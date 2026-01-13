"use client";

import { useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

interface EmailOTPFormProps {
  onGenerateOTP: () => Promise<void>;
  onSubmit: (code: string) => void;
  onBack?: () => void;
  isGenerating?: boolean;
  otpSent?: boolean;
  isVerifying?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * Email OTP Verification Form Component
 *
 * Flow:
 * 1. User clicks "Send code" button
 * 2. OTP is sent to email
 * 3. User enters 6-digit code
 * 4. User submits for verification
 */
export function EmailOTPForm({
  onGenerateOTP,
  onSubmit,
  onBack,
  isGenerating = false,
  otpSent = false,
  isVerifying = false,
  error,
  className,
}: EmailOTPFormProps) {
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

  const handleResendOTP = async () => {
    setOtpValue("");
    await onGenerateOTP();
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Step 1: Generate OTP Button (if not yet sent) */}
      {!otpSent ? (
        <div className="text-center space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="size-8 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-lg">Email Verification Required</h3>
            <p className="text-sm text-muted-foreground mt-2">
              We need to verify your identity. Click the button below to receive a verification
              code by email.
            </p>
          </div>
          <Button
            type="button"
            onClick={onGenerateOTP}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 size-4" />
                Send Verification Code
              </>
            )}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      ) : (
        /* Step 2: OTP Input Form (after code is sent) */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
              <Mail className="size-6 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              A verification code has been sent to your email address. Please enter it below.
            </p>
          </div>

          {/* Resend OTP link (Moved to top) */}
          <div className="text-center py-2 border-y border-dashed bg-muted/20">
            <p className="text-xs text-muted-foreground mb-1">Didn't receive the code?</p>
            <Button
              type="button"
              variant="link"
              onClick={handleResendOTP}
              disabled={isGenerating}
              className="h-auto p-0 font-medium text-primary hover:underline disabled:opacity-50"
            >
              {isGenerating ? "Sending..." : "Resend code now"}
            </Button>
          </div>

          <div className="flex flex-col items-center gap-4">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={handleOtpChange}
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

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button
            type="submit"
            className="w-full"
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
        </form>
      )}

      {/* Back to login link */}
      {onBack && (
        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            Back to Login
          </Button>
        </div>
      )}
    </div>
  );
}
