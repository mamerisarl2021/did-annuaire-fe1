"use client";

import { Suspense, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccountActivation } from "@/lib/features/auth/hooks/useAccountActivation";
import { useTwoFactorSetup } from "@/lib/features/auth/hooks/useTwoFactorSetup";
import { ActivationForm } from "@/lib/features/auth/components/ActivationForm";
import { type ActivateAccountFormData } from "@/lib/features/auth/schemas/activate.schema";

/**
 * Activation flow states
 */
type ActivationState = "FORM" | "SUCCESS";

/**
 * Activation page content component
 * Orchestrates the activation flow with proper SRP
 */
function ActivateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Activation state
  const [activationState, setActivationState] = useState<ActivationState>("FORM");
  const [show2FASetup, setShow2FASetup] = useState(false);

  // Account activation hook (password setup)
  const activation = useAccountActivation({ token });

  // 2FA setup hook
  const twoFactor = useTwoFactorSetup({
    onSetupComplete: () => {
      // 2FA verified - can now finalize
    },
  });

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (data: ActivateAccountFormData) => {
      if (data.enableOtp && show2FASetup && !data.code) {
        return;
      }
      const result = await activation.activateAccount(data);

      if (!result.success) {
        return;
      }
      if (result.requiresOtp && result.qrCodeData) {
        twoFactor.setQrCode(result.qrCodeData);
        setShow2FASetup(true);
        return;
      }

      setActivationState("SUCCESS");
    },
    [activation, twoFactor, show2FASetup]
  );

  /**
   * Handle navigation to login
   */
  const handleGoToLogin = useCallback(() => {
    router.push("/auth/login");
  }, [router]);

  // Invalid token state
  if (!activation.hasValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-destructive">Invalid Link</CardTitle>
            <CardDescription>The activation link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={handleGoToLogin} variant="outline">
              Back to login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (activationState === "SUCCESS") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-6 text-center space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-green-700">
                Account activated successfully!
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Your account has been activated. You can now log in.
              </p>
            </div>
            <Button onClick={handleGoToLogin} className="w-full">
              Log in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form state
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Activate your account</CardTitle>
          <CardDescription>
            {show2FASetup
              ? "Set up Two-Factor Authentication"
              : "Set your password to complete activation"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Error Alert */}
          {activation.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{activation.error}</AlertDescription>
            </Alert>
          )}

          {/* Activation Form */}
          <ActivationForm
            form={activation.form}
            onSubmit={handleSubmit}
            isSubmitting={activation.isActivating}
            isDisabled={!activation.hasValidToken}
            show2FASetup={show2FASetup}
            qrCodeData={twoFactor.qrCodeData}
            is2FAVerified={twoFactor.isVerified}
            twoFactorError={twoFactor.error}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Account Activation Page
 *
 * Route: /activate?token=xxx
 *
 * Flow:
 * 1. User enters password + optional 2FA checkbox
 * 2. If 2FA enabled: Show QR code and verify OTP BEFORE finalizing
 * 3. On success: Redirect to login
 */
export default function ActivatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="size-8 animate-spin text-gray-500" />
        </div>
      }
    >
      <ActivateContent />
    </Suspense>
  );
}
