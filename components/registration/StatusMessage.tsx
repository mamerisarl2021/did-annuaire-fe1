import * as React from "react";
import Link from "next/link";
import { Mail, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OrganizationStatus, type OrganizationStatusType } from "@/lib/types/organization-status";

interface StatusMessageProps {
  status: OrganizationStatusType;
  organizationName?: string;
  className?: string;
}

/**
 * Status Message Component
 * Displays contextual message and actions based on status
 */
export function StatusMessage({ status, organizationName, className }: StatusMessageProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {status === OrganizationStatus.PENDING && (
        <>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="font-medium text-yellow-800">En attente de validation</h3>
            <p className="mt-1 text-sm text-yellow-700">
              Votre demande de création d&apos;organisation
              {organizationName && <strong> «{organizationName}»</strong>} est en cours
              d&apos;examen par notre équipe.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
            <Mail className="mt-0.5 size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Notification par email</p>
              <p className="text-sm text-muted-foreground">
                Vous recevrez un email dès qu&apos;une décision sera prise concernant votre demande.
              </p>
            </div>
          </div>

          <Button variant="outline" className="w-full gap-2" asChild>
            <Link href="mailto:support@did-annuaire.com">
              <ExternalLink className="size-4" />
              Contacter le support
            </Link>
          </Button>
        </>
      )}

      {status === OrganizationStatus.ACTIVE && (
        <>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="font-medium text-green-800">Organisation validée !</h3>
            <p className="mt-1 text-sm text-green-700">
              Félicitations ! Votre organisation a été approuvée. Vous pouvez maintenant activer
              votre compte administrateur.
            </p>
          </div>

          <Button className="w-full" size="lg" asChild>
            <Link href="/auth/activate">Activer mon compte</Link>
          </Button>
        </>
      )}

      {status === OrganizationStatus.REFUSED && (
        <>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="font-medium text-red-800">Demande refusée</h3>
            <p className="mt-1 text-sm text-red-700">
              Nous sommes désolés, mais votre demande de création d&apos;organisation n&apos;a pas
              été approuvée. Les raisons détaillées vous ont été communiquées par email.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
            <Mail className="mt-0.5 size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Consultez votre email</p>
              <p className="text-sm text-muted-foreground">
                Un email contenant les motifs du refus vous a été envoyé.
              </p>
            </div>
          </div>

          <Button variant="outline" className="w-full gap-2" asChild>
            <Link href="mailto:support@did-annuaire.com">
              <ExternalLink className="size-4" />
              Contacter le support
            </Link>
          </Button>
        </>
      )}

      {status === OrganizationStatus.SUSPENDED && (
        <>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="font-medium text-gray-800">Organisation suspendue</h3>
            <p className="mt-1 text-sm text-gray-700">
              Votre organisation est actuellement suspendue. Veuillez contacter
              l&apos;administration pour plus d&apos;informations.
            </p>
          </div>

          <Button variant="outline" className="w-full gap-2" asChild>
            <Link href="mailto:admin@did-annuaire.com">
              <ExternalLink className="size-4" />
              Contacter l&apos;administration
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
