"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLoginWorkflow } from "@/lib/features/auth/hooks/useLoginWorkflow";
import { useRoleRedirect } from "@/lib/guards/useRoleRedirect";
import { LoginFormComponent } from "@/lib/features/auth/components/LoginFormComponent";
import { OTPForm } from "@/lib/features/auth/components/OTPForm";
import { type AuthUser } from "@/lib/features/auth/types/auth.types";

/**
 * Login Page
 *
 * Route: /auth/login
 *
 * Flow:
 * 1. User enters email + password
 * 2. If 2FA enabled: Show OTP verification screen
 * 3. On success: Redirect to role-based dashboard
 *
 * Architecture:
 * - Page has NO knowledge of roles or dashboard routes
 * - All routing logic delegated to useRoleRedirect
 * - All login logic delegated to useLoginWorkflow
 */
export default function LoginPage() {
  const { redirectToRoleDashboard } = useRoleRedirect();

  /**
   * Handle successful login - redirect to appropriate dashboard
   */
  const handleLoginComplete = (user: AuthUser) => {
    redirectToRoleDashboard(user.role);
  };

  const {
    currentStep,
    form,
    isLoggingIn,
    isVerifyingOTP,
    error,
    submitCredentials,
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
            </CardContent>
          </Card>
        );

      case "OTP_REQUIRED":
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

              {/* OTP Form */}
              <OTPForm
                onSubmit={verifyOTP}
                onBack={goBackToCredentials}
                isVerifying={isVerifyingOTP}
              />
            </CardContent>
          </Card>
        );

      case "SUCCESS":
        // This state is brief - user will be redirected
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
