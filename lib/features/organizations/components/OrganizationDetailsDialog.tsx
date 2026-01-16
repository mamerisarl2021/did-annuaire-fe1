"use client";

import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrganizationStatusBadge } from "./OrganizationStatusBadge";
import { type OrganizationListItem } from "../types/organization.types";

interface OrganizationDetailsDialogProps {
  organization: OrganizationListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValidate?: (orgId: string) => void;
  onRefuse?: () => void;
  isActionsDisabled?: boolean;
}

/**
 * Pure UI component for displaying organization details
 *
 * Responsibilities:
 * - Displays organization information in a dialog
 * - Shows validate/refuse buttons for pending organizations
 * - Delegates all actions to parent
 */
export function OrganizationDetailsDialog({
  organization,
  open,
  onOpenChange,
  onValidate,
  onRefuse,
  isActionsDisabled = false,
}: OrganizationDetailsDialogProps) {
  if (!organization) return null;

  const isPending = organization.status === "PENDING";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{organization.name}</DialogTitle>
          <DialogDescription>Organization Details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Type</Label>
              <div className="font-medium">{organization.type}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Country</Label>
              <div className="font-medium">{organization.country}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email Organization</Label>
              <div className="font-medium break-all">{organization.email}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email Admin</Label>
              <div className="font-medium break-all">{organization.adminEmail}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Slug</Label>
              <div className="font-medium">{organization.slug}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Created Date</Label>
              <div className="font-medium">
                {new Date(organization.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="mt-1">
                <OrganizationStatusBadge status={organization.status} />
              </div>
            </div>

            {/* Documents Section */}
            <div className="col-span-2 space-y-3 pt-2">
              <Label className="text-xs text-muted-foreground">Documents</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    name: "Authorization Document",
                    url: organization.authorization_document,
                    id: "auth-doc",
                  },
                  {
                    name: "Justification Document",
                    url: organization.justification_document,
                    id: "just-doc",
                  },
                ]
                  .filter((doc) => doc.url)
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 rounded-md border bg-muted/20"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="size-4 text-primary shrink-0" />
                        <span className="text-sm font-medium truncate">{doc.name}</span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="size-8" asChild title="View">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="set url doc"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          asChild
                          title="Download"
                        >
                          <a href={doc.url} download title="download doc">
                            <Download className="size-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                {!organization.authorization_document && !organization.justification_document && (
                  <p className="text-sm text-muted-foreground italic">No documents provided</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between gap-2">
          {isPending ? (
            <div className="flex gap-2 w-full justify-end">
              <Button variant="destructive" onClick={onRefuse} disabled={isActionsDisabled}>
                Refuse
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onValidate?.(organization.id)}
                disabled={isActionsDisabled}
              >
                Validate
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
