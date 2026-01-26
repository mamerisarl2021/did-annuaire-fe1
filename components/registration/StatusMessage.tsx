import Link from "next/link";
import { Mail, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OrganizationStatus, type OrganizationStatusType } from "@/lib/types/organization-status";

interface StatusMessageProps {
  status: OrganizationStatusType;
  organizationName?: string;
  activationToken?: string;
  className?: string;
}

/**
 * Status Message Component
 * Displays contextual message and actions based on status
 */
export function StatusMessage({ status, organizationName, activationToken, className }: StatusMessageProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {status === OrganizationStatus.PENDING && (
        <>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="font-medium text-yellow-800">Pending Validation</h3>
            <p className="mt-1 text-sm text-yellow-700">
              Your organization creation request
              {organizationName && <strong> &quot;{organizationName}&quot;</strong>} is currently
              under review by our team.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
            <Mail className="mt-0.5 size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email Notification</p>
              <p className="text-sm text-muted-foreground">
                You will receive an email as soon as a decision is made regarding your request.
              </p>
            </div>
          </div>

          <Button variant="outline" className="w-full gap-2" asChild>
            <Link href="mailto:support@did-annuaire.com">
              <ExternalLink className="size-4" />
              Contact Support
            </Link>
          </Button>
        </>
      )}

      {status === OrganizationStatus.ACTIVE && (
        <>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="font-medium text-green-800">Organization Validated!</h3>
            <p className="mt-1 text-sm text-green-700">
              Congratulations! Your organization has been approved. You can now activate your
              administrator account.
            </p>
          </div>

          <Button className="w-full" size="lg" asChild>
            <Link href={activationToken ? `/activate?token=${activationToken}` : "/auth/activate"}>
              Activate my account
            </Link>
          </Button>
        </>
      )}

      {status === OrganizationStatus.REFUSED && (
        <>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="font-medium text-red-800">Request Refused</h3>
            <p className="mt-1 text-sm text-red-700">
              We are sorry, but your organization creation request has not been approved. Detailed
              reasons have been sent to you by email.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
            <Mail className="mt-0.5 size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Check your email</p>
              <p className="text-sm text-muted-foreground">
                An email containing the reasons for refusal has been sent to you.
              </p>
            </div>
          </div>

          <Button variant="outline" className="w-full gap-2" asChild>
            <Link href="mailto:support@did-annuaire.com">
              <ExternalLink className="size-4" />
              Contact Support
            </Link>
          </Button>
        </>
      )}

      {status === OrganizationStatus.SUSPENDED && (
        <>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="font-medium text-gray-800">Organization Suspended</h3>
            <p className="mt-1 text-sm text-gray-700">
              Your organization is currently suspended. Please contact administration for more
              information.
            </p>
          </div>

          <Button variant="outline" className="w-full gap-2" asChild>
            <Link href="mailto:admin@did-annuaire.com">
              <ExternalLink className="size-4" />
              Contact Administration
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
