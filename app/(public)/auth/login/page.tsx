"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLoginWorkflow } from "@/lib/features/auth/hooks/useLoginWorkflow";
import { LoginFormComponent } from "@/lib/features/auth/components/LoginFormComponent";
import { OTPForm } from "@/lib/features/auth/components/OTPForm";
import { EmailOTPForm } from "@/lib/features/auth/components/EmailOTPForm";
import { getDashboardRoute } from "@/lib/types/roles";
import { type AuthUser } from "@/lib/features/auth/types/auth.types";

export default function LoginPage() {
  const router = useRouter();

  /**
   * Handle successful login - redirect to specific dashboard based on role
   */
  const handleLoginComplete = (user: AuthUser) => {
    const targetRoute = getDashboardRoute(user.role);
    router.push(targetRoute);
  };

  const {
    currentStep,
    form,
    isLoggingIn,
    isGeneratingOTP,
    otpSent,
    isVerifyingOTP,
    error,
    submitCredentials,
    generateEmailOTP,
    verifyOTP,
    goBackToCredentials,
  } = useLoginWorkflow({
    onLoginComplete: handleLoginComplete,
  });

  /**
   * Render content based on login step
   */
  const renderContent = () => {
    switch (currentStep) {
      case "CREDENTIALS":
        return (
          <Card className="shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription>Log in to your account to access the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              <LoginFormComponent
                form={form}
                onSubmit={submitCredentials}
                isSubmitting={isLoggingIn}
              />

              {/* Register Link */}
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don&apos;t have an account? </span>
                <Link href="/auth/register" className="font-medium text-primary hover:underline">
                  Register Organization
                </Link>
              </div>

              {/* Forgot Password Link */}
              <div className="mt-2 text-center text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </CardContent>
          </Card>
        );

      case "TOTP_REQUIRED":
        return (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="size-6 text-primary" />
              </div>
              <CardTitle className="text-xl">2FA Verification</CardTitle>
              <CardDescription>Enter the code from your authenticator app</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* OTP Form (for TOTP/authenticator app) */}
              <OTPForm
                onSubmit={verifyOTP}
                onBack={goBackToCredentials}
                isVerifying={isVerifyingOTP}
              />
            </CardContent>
          </Card>
        );

      case "EMAIL_OTP_REQUIRED":
        return (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="size-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Email Verification</CardTitle>
              <CardDescription>
                {otpSent ? "Enter the code sent to your email" : "Verify your identity via email"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailOTPForm
                onGenerateOTP={generateEmailOTP}
                onSubmit={verifyOTP}
                onBack={goBackToCredentials}
                isGenerating={isGeneratingOTP}
                otpSent={otpSent}
                isVerifying={isVerifyingOTP}
                error={error}
              />
            </CardContent>
          </Card>
        );

      case "SUCCESS":
        return (
          <Card className="shadow-lg">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Redirecting...</p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">{renderContent()}</div>
    </div>
  );
}
