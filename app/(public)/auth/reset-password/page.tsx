"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { usePasswordResetWorkflow } from "@/lib/features/auth/hooks/usePasswordResetWorkflow";
import { PasswordResetConfirmForm } from "@/lib/features/auth/components/PasswordResetFormComponent";
import { getPasswordStrengthLabel } from "@/lib/schemas/activation.schema";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    currentStep,
    confirmForm,
    isLoading,
    error,
    passwordStrength,
    confirmPasswordReset,
    goBackToRequest,
  } = usePasswordResetWorkflow();

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      goBackToRequest();
      router.push("/auth/forgot-password");
    }
  }, [token, router, goBackToRequest]);

  // Auto-redirect after success
  useEffect(() => {
    if (currentStep === "SUCCESS") {
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, router]);

  const handleSubmit = async (data: { password: string; confirmPassword: string }) => {
    if (token) {
      await confirmPasswordReset(data.password, token);
    }
  };

  // Success State
  if (currentStep === "SUCCESS") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="size-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Mot de passe réinitialisé !</CardTitle>
              <CardDescription>Votre mot de passe a été modifié avec succès.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/login">
                <Button className="w-full">Se connecter</Button>
              </Link>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Redirection automatique dans 3 secondes...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Token Invalid State
  if (currentStep === "TOKEN_INVALID") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="size-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Lien invalide ou expiré</CardTitle>
              <CardDescription>Ce lien de réinitialisation n&apos;est plus valide.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  Les liens de réinitialisation expirent après 1 heure ou après avoir été utilisés.
                </AlertDescription>
              </Alert>

              <Link href="/auth/forgot-password">
                <Button className="w-full">Demander un nouveau lien</Button>
              </Link>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Retour à la connexion
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Reset Form State
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Réinitialiser votre mot de passe</CardTitle>
            <CardDescription>Entrez votre nouveau mot de passe ci-dessous</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Reset Form */}
            <PasswordResetConfirmForm
              form={confirmForm}
              onSubmit={handleSubmit}
              isSubmitting={isLoading}
              passwordStrength={getPasswordStrengthLabel(passwordStrength.score)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
