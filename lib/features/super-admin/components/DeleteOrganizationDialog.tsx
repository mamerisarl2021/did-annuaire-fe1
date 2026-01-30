"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteOrganizationDialogProps {
  organizationName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * Pure UI component for confirming organization deletion
 *
 * Responsibilities:
 * - Displays confirmation warning
 * - Delegates confirmation to parent
 */
export function DeleteOrganizationDialog({
  organizationName,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteOrganizationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            Delete Organization
          </DialogTitle>
          <DialogDescription>
            {organizationName
              ? `You are about to delete "${organizationName}".`
              : "You are about to delete this organization."}
            <br />
            <strong className="text-destructive">This action is irreversible.</strong>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Permanently"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
