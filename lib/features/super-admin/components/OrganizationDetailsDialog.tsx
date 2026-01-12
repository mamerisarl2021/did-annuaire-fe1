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
import { Button } from "@/components/ui/button";
import { OrganizationStatusBadge } from "./OrganizationStatusBadge";
import { type OrganizationListItem } from "../types/organization.types";

interface OrganizationDetailsDialogProps {
  /** The organization to display */
  organization: OrganizationListItem | null;
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog should close */
  onOpenChange: (open: boolean) => void;
  /** Callback when validate is clicked (only for PENDING) */
  onValidate?: (orgId: string) => void;
  /** Callback when refuse is clicked (only for PENDING) */
  onRefuse?: () => void;
  /** Whether actions are disabled */
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
              <Label className="text-xs text-muted-foreground">Email Org</Label>
              <div className="font-medium break-all">{organization.email}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email Admin</Label>
              <div className="font-medium break-all">{organization.adminEmail}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Phone</Label>
              <div className="font-medium">{organization.phone || "-"}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Created at</Label>
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
