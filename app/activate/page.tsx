"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authService } from "@/lib/features/auth/services/auth.service";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { TOTPSetupForm } from "@/components/forms/activation/TOTPSetupForm";
import { otpSchema, type OTPFormData } from "@/lib/schemas/otp.schema";

const activateSchema = z
  .object({
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
    enableOtp: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ActivateFormValues = z.infer<typeof activateSchema>;

function ActivateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [step, setStep] = useState<"form" | "otp_setup" | "success">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [qrCodeData, setQrCodeData] = useState<{ qr_code?: string; secret?: string } | null>(null);

  // Initial Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ActivateFormValues>({
    resolver: zodResolver(activateSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      enableOtp: false,
    },
  });

  // OTP Form
  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    if (!token) {
      setErrorMessage("Jeton d'activation manquant ou invalide.");
    }
  }, [token]);

  const onFormSubmit = async (data: ActivateFormValues) => {
    if (!token) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await authService.activateAccount({
        token,
        password: data.password,
        re_password: data.confirmPassword,
        enable_otp: data.enableOtp,
      });

      if (data.enableOtp && response?.qr_code) {
        setQrCodeData(response);
        setStep("otp_setup");
      } else {
        setStep("success");
        setTimeout(() => router.push("/auth/login"), 3000);
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Échec de l'activation. Le lien a peut-être expiré.");
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOTP = async (data: OTPFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      await authService.verifyOTP(data.otp_code);
      setStep("success");
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage("Code OTP invalide ou expiré.");
      otpForm.setError("otp_code", { message: "Code invalide" });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Compte activé !</CardTitle>
            <CardDescription>
              Votre compte est prêt. Vous allez être redirigé vers la page de connexion.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => router.push("/auth/login")}>Se connecter maintenant</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {step === "otp_setup" ? "Configuration 2FA" : "Activer votre compte"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === "otp_setup"
              ? "Veuillez scanner le QR Code et entrer le code de vérification."
              : "Veuillez définir votre mot de passe pour finaliser l'activation."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {step === "form" && (
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="enableOtp"
                  onCheckedChange={(checked) => setValue("enableOtp", checked as boolean)}
                />
                <Label htmlFor="enableOtp" className="cursor-pointer">
                  Activer l&apos;authentification à deux facteurs (2FA)
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !token}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Activer le compte
              </Button>
            </form>
          )}

          {step === "otp_setup" && qrCodeData && (
            <TOTPSetupForm
              form={otpForm}
              onSubmit={onVerifyOTP}
              isVerifying={isLoading}
              qrCodeUrl={qrCodeData.qr_code}
              secretKey={qrCodeData.secret}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      }
    >
      <ActivateContent />
    </Suspense>
  );
}
