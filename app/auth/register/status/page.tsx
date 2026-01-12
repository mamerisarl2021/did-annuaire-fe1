import * as React from "react";
import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, RegistrationStepper, StatusMessage } from "@/components/registration";
import {
  OrganizationStatus,
  type OrganizationStatusType,
  getRegistrationSteps,
} from "@/lib/types/organization-status";

interface RegistrationStatusPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function RegistrationStatusPage({
  searchParams,
}: RegistrationStatusPageProps) {
  const params = await searchParams;

  const statusParam = params.status?.toUpperCase() as OrganizationStatusType | undefined;
  const status: OrganizationStatusType =
    statusParam && Object.values(OrganizationStatus).includes(statusParam)
      ? statusParam
      : OrganizationStatus.PENDING;

  const organizationName = "My Organization";

  const steps = getRegistrationSteps(status);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild className="gap-2">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </Button>

      {/* Main card */}
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          {/* Organization icon */}
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="size-8 text-primary" />
          </div>

          <CardTitle className="text-2xl">Registration Status</CardTitle>

          {/* Status badge */}
          <div className="mt-4 flex justify-center">
            <StatusBadge status={status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Progress stepper */}
          <div className="rounded-lg border bg-muted/30 p-6">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Progress</h3>
            <RegistrationStepper steps={steps} />
          </div>

          {/* Status-specific message and actions */}
          <StatusMessage status={status} organizationName={organizationName} />
        </CardContent>
      </Card>

      {/* Help section */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Questions? Check our{" "}
          <Link href="/faq" className="text-primary hover:underline">
            FAQ
          </Link>{" "}
          or{" "}
          <Link href="mailto:support@did-annuaire.com" className="text-primary hover:underline">
            contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
