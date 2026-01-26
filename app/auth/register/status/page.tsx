"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, ArrowLeft, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, RegistrationStepper, StatusMessage } from "@/components/registration";
import {
  OrganizationStatus,
  type OrganizationStatusType,
  getRegistrationSteps,
} from "@/lib/types/organization-status";
import { useOrganizationStatus } from "@/lib/features/organizations/hooks/useOrganizationStatus";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function RegistrationStatusPage() {
  const searchParams = useSearchParams();
  const organizationId = searchParams.get("organizationId");
  const organizationName = searchParams.get("organizationName") || "My Organization";

  const { status, isLoading, refetch } = useOrganizationStatus({
    organizationId: organizationId || undefined,
    pollingInterval: 30000,
    enabled: !!organizationId,
  });

  const currentStatus: OrganizationStatusType = status || OrganizationStatus.PENDING;
  const steps = getRegistrationSteps(currentStatus);

  if (isLoading && !status) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <Skeleton className="mx-auto h-16 w-16 rounded-full" />
            <Skeleton className="mx-auto mt-4 h-8 w-48" />
            <Skeleton className="mx-auto mt-4 h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Status
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="size-8 text-primary" />
          </div>

          <CardTitle className="text-2xl">Registration Status</CardTitle>

          <div className="mt-4 flex justify-center">
            <StatusBadge status={currentStatus} organizationName={organizationName} />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="rounded-lg border bg-muted/30 p-6">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Progress</h3>
            <RegistrationStepper steps={steps} />
          </div>

          <StatusMessage status={currentStatus} organizationName={organizationName} />

          {currentStatus === OrganizationStatus.PENDING && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-medium">Auto-refresh enabled</p>
              <p className="mt-1 text-blue-600">
                This page automatically checks for updates every 30 seconds.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
