"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/login";
import { TOTPSetupForm, OTPEmailForm } from "@/components/forms/activation";
import { useLoginForm } from "@/lib/hooks/useLoginForm";
import { useOTPVerification } from "@/lib/hooks/useOTPVerification";
import { useRoleRedirect } from "@/lib/guards/useRoleRedirect";
import type { LoginFormData } from "@/lib/schemas/login.schema";

type LoginStep = "CREDENTIALS" | "OTP_TOTP" | "OTP_EMAIL";
import { useLogin } from "@/lib/features/auth/hooks/useLogin";
import { authService } from "@/lib/features/auth/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [loginStep, setLoginStep] = React.useState<LoginStep>("CREDENTIALS");

  const { form, onSubmit, isSubmitting: isFormSubmitting } = useLoginForm();
  const { redirectToRoleDashboard } = useRoleRedirect();

  const { login, isLoading: isLoginLoading, error: loginError } = useLogin();

  const isSubmitting = isFormSubmitting || isLoginLoading;

  const otpVerification = useOTPVerification({
    method: "TOTP",
    onVerified: async () => {
      const user = await authService.getCurrentUser();
      if (user) redirectToRoleDashboard(user.role);
    },
  });

  /**
   * Handle login form submission
   */
  const handleLoginSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });

      const user = await authService.getCurrentUser();
      console.log("Logged in user:", user);

      if (user && user.role) {
        redirectToRoleDashboard(user.role);
        return;
      }

      console.warn("User has no role or is null", user);
      if (user) {
        router.push("/dashboard");
      } else {
        throw new Error("Impossible de récupérer le profil utilisateur.");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Erreur: " + (error instanceof Error ? error.message : "Erreur inconnue"));
    }
  };

  /**
   * Render content based on login step
   */
  const renderContent = () => {
    switch (loginStep) {
      case "CREDENTIALS":
        return (
          <Card className="shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
              <CardDescription>
                Connectez-vous à votre compte pour accéder à la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loginError && (
                <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {loginError}
                </div>
              )}

              <LoginForm
                form={form}
                onSubmit={onSubmit(handleLoginSubmit)}
                isSubmitting={isSubmitting}
              />

              {/* Register Link */}
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Vous n&apos;avez pas de compte ? </span>
                <Link href="/auth/register" className="font-medium text-primary hover:underline">
                  Créer une organisation
                </Link>
              </div>
            </CardContent>
          </Card>
        );

      case "OTP_TOTP":
        return (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Vérification OTP</CardTitle>
              <CardDescription>
                Entrez le code de votre application d&apos;authentification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TOTPSetupForm
                form={otpVerification.form}
                onSubmit={otpVerification.verifyOTP}
                isVerifying={otpVerification.isVerifying}
              />

              {/* Back to login */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setLoginStep("CREDENTIALS")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Retour à la connexion
                </button>
              </div>
            </CardContent>
          </Card>
        );

      case "OTP_EMAIL":
        return (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Vérification par email</CardTitle>
              <CardDescription>
                Vérifiez votre identité avec un code envoyé par email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OTPEmailForm
                form={otpVerification.form}
                onSubmit={otpVerification.verifyOTP}
                onGenerateOTP={otpVerification.generateEmailOTP}
                isGenerating={otpVerification.isGenerating}
                isVerifying={otpVerification.isVerifying}
                otpSent={otpVerification.otpSent}
              />

              {/* Back to login */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setLoginStep("CREDENTIALS")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Retour à la connexion
                </button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return renderContent();
}
