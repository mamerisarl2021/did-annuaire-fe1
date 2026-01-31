"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Stepper,
  Step1Organization,
  Step2Admin,
  Step3Documents,
} from "@/components/forms/register";
import { useStepper } from "@/lib/hooks/useStepper";
import { useRegisterForm } from "@/lib/features/organizations/hooks/useRegisterForm";
import { REGISTER_STEPS, type RegisterFormData } from "@/lib/schemas/register.schema";
import { useCreateOrganization } from "@/lib/features/organizations/hooks/useCreateOrganization";
import { type OrgCreatePayload } from "@/lib/features/organizations/types/organization.types";

/**
 * Register Page
 * Multi-step organization registration
 * Orchestrates stepper and form using hooks
 */
export default function RegisterPage() {
  const router = useRouter();
  const { currentStep, isFirstStep, isLastStep, next, prev } = useStepper({
    totalSteps: REGISTER_STEPS.length,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{ orgId: string; name: string } | null>(null);

  const { form, validateStep, onSubmit, isSubmitting: isFormSubmitting } = useRegisterForm();

  const { createOrganization, isLoading: isApiLoading, error: apiError } = useCreateOrganization();

  const isSubmitting = isFormSubmitting || isApiLoading;

  /**
   * Handle next step with validation
   */
  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      next();
    }
  };

  /**
   * Handle final form submission
   */
  const handleSubmit = async (data: RegisterFormData) => {
    try {
      const payload: OrgCreatePayload = {
        // Step 1
        name: data.name,
        org_type: data.org_type,
        country: data.country,
        email: data.email,
        phone: data.phone,
        address: data.address,
        allowed_email_domains: data.allowed_email_domains.map((d) => d.value),

        // Step 2
        admin_email: data.admin_email,
        admin_first_name: data.admin_first_name,
        admin_last_name: data.admin_last_name,
        admin_phone: data.admin_phone,
        admin_functions: data.functions,

        // Step 3
        authorization_document: data.authorization_document,
        justification_document: data.justification_document || undefined,
      };

      const createdOrg = await createOrganization(payload);

      setSuccessData({
        orgId: createdOrg.id,
        name: data.name,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  /**
   * Render current step content
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Organization form={form} />;
      case 2:
        return <Step2Admin form={form} />;
      case 3:
        return <Step3Documents form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <Stepper
        steps={REGISTER_STEPS.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
        }))}
        currentStep={currentStep}
      />

      {/* Form Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Create an Organization</CardTitle>
        </CardHeader>
        <CardContent>
          {apiError && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
              <p className="font-medium">An error occurred</p>
              <p>{apiError}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={onSubmit(handleSubmit)}>
              {/* Step Content */}
              <div className="min-h-[400px]">{renderStepContent()}</div>

              {/* Navigation Buttons */}
              <div className="mt-8 flex items-center justify-between border-t pt-6">
                <div>
                  {!isFirstStep && (
                    <Button type="button" variant="outline" onClick={prev} disabled={isSubmitting}>
                      <ArrowLeft className="size-4" />
                      Previous
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {isLastStep ? (
                    <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="size-4" />
                          Finalize
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                      Next
                      <ArrowRight className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="w-full max-w-sm" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Organization Created Successfully</DialogTitle>
            <DialogDescription className="pt-2">
              Your organization <strong>{successData?.name}</strong> has been registered.
              <br />
              Please proceed to check the validation status.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-2">
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                if (successData) {
                  router.push(
                    `/auth/register/status?organizationId=${successData.orgId}&organizationName=${encodeURIComponent(
                      successData.name
                    )}`
                  );
                }
              }}
            >
              View Registration Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
