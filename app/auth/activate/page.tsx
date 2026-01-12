"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PasswordSetupForm, TOTPSetupForm, OTPEmailForm } from "@/components/forms/activation";
import { useActivationFlow } from "@/lib/hooks/useActivationFlow";
import { useOTPVerification } from "@/lib/hooks/useOTPVerification";
import { useRoleRedirect } from "@/lib/guards/useRoleRedirect";
import { ActivationStep } from "@/lib/types/activation";
import { UserRole } from "@/lib/types/roles";

/**
 * Loading skeleton for the activation page
 */
function ActivateLoading() {
  return (
    <Card className="shadow-lg">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Chargement...</p>
      </CardContent>
    </Card>
  );
}

/**
 * Activation page content (uses useSearchParams)
 * Multi-step flow: Password Setup → OTP Setup (optional) → Complete
 * Orchestrates components using hooks
 */
function ActivateContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { currentStep, enableTotp, passwordForm, submitPasswordStep, completeOTPStep } =
    useActivationFlow();

  const { redirectToRoleDashboard } = useRoleRedirect();

  const otpVerification = useOTPVerification({
    method: enableTotp ? "TOTP" : "EMAIL",
    onVerified: completeOTPStep,
  });

  const handleComplete = () => {
    redirectToRoleDashboard(UserRole.ORG_ADMIN);
  };

  if (!token) {
    return (
      <Card className="shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="size-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold">Lien invalide</h2>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Le lien d&apos;activation est invalide ou a expiré.
            <br />
            Veuillez contacter l&apos;administrateur.
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case ActivationStep.PASSWORD_SETUP:
        return (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Activation du compte</CardTitle>
              <CardDescription>
                Définissez votre mot de passe pour activer votre compte administrateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordSetupForm form={passwordForm} onSubmit={submitPasswordStep} />
            </CardContent>
          </Card>
        );

      case ActivationStep.OTP_SETUP:
        return (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Configuration OTP</CardTitle>
              <CardDescription>
                Sécurisez votre compte avec la double authentification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enableTotp ? (
                <TOTPSetupForm
                  form={otpVerification.form}
                  onSubmit={otpVerification.verifyOTP}
                  isVerifying={otpVerification.isVerifying}
                />
              ) : (
                <OTPEmailForm
                  form={otpVerification.form}
                  onSubmit={otpVerification.verifyOTP}
                  onGenerateOTP={otpVerification.generateEmailOTP}
                  isGenerating={otpVerification.isGenerating}
                  isVerifying={otpVerification.isVerifying}
                  otpSent={otpVerification.otpSent}
                />
              )}
            </CardContent>
          </Card>
        );

      case ActivationStep.COMPLETE:
        return (
          <Card className="shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">Compte activé !</h2>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Votre compte administrateur a été activé avec succès.
                <br />
                Vous pouvez maintenant accéder à votre tableau de bord.
              </p>
              <Button onClick={handleComplete} className="mt-6" size="lg">
                Accéder au tableau de bord
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      {currentStep !== ActivationStep.COMPLETE && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className={
                currentStep === ActivationStep.PASSWORD_SETUP ? "font-medium text-primary" : ""
              }
            >
              1. Mot de passe
            </span>
            <span>→</span>
            <span
              className={currentStep === ActivationStep.OTP_SETUP ? "font-medium text-primary" : ""}
            >
              2. Sécurité
            </span>
          </div>
        </div>
      )}

      {renderStepContent()}
    </div>
  );
}

/**
 * Account Activation Page
 * Wrapped in Suspense for useSearchParams
 */
export default function ActivatePage() {
  return (
    <Suspense fallback={<ActivateLoading />}>
      <ActivateContent />
    </Suspense>
  );
}
