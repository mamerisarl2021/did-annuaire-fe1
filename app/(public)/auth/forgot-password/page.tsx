"use client";

import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { usePasswordResetWorkflow } from "@/lib/features/auth/hooks/usePasswordResetWorkflow";
import { PasswordResetRequestForm } from "@/lib/features/auth/components/PasswordResetFormComponent";

export default function ForgotPasswordPage() {
  const { currentStep, requestForm, isLoading, error, requestPasswordReset } =
    usePasswordResetWorkflow();

  const handleSubmit = async (data: { email: string }) => {
    await requestPasswordReset(data.email);
  };

  if (currentStep === "REQUEST_SUCCESS") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100">
                <Mail className="size-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Email envoyé !</CardTitle>
              <CardDescription>
                Si votre adresse email existe dans notre système, vous recevrez un lien de
                réinitialisation dans quelques minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>N&apos;oubliez pas de vérifier vos spams.</strong>
                  <br />
                  Le lien expire dans 1 heure.
                </AlertDescription>
              </Alert>

              <div className="text-center">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft size={16} className="mr-2" />
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Mot de passe oublié ?</CardTitle>
            <CardDescription>
              Entrez votre adresse email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Alert */}
            <ErrorAlert error={error} className="mb-4" />

            {/* Request Form */}
            <PasswordResetRequestForm
              form={requestForm}
              onSubmit={handleSubmit}
              isSubmitting={isLoading}
            />

            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft size={14} className="mr-1 inline" />
                Retour à la connexion
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
