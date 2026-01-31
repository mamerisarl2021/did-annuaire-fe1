"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface RefuseOrganizationDialogProps {
  /** Name of the organization being refused (for display) */
  organizationName?: string;
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog should close */
  onOpenChange: (open: boolean) => void;
  /** Callback when refuse is confirmed */
  onConfirm: (reason: string) => Promise<void>;
  /** Whether the action is in progress */
  isLoading?: boolean;
}

/**
 * Pure UI component for refusing an organization
 *
 * Responsibilities:
 * - Collects refusal reason
 * - Validates reason is not empty
 * - Delegates confirmation to parent
 */
export function RefuseOrganizationDialog({
  organizationName,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: RefuseOrganizationDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    await onConfirm(reason);
    setReason("");
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setReason("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <DialogTitle>Refuse Organization</DialogTitle>
          <DialogDescription>
            {organizationName
              ? `You are about to refuse "${organizationName}".`
              : "Specify reason for refusal."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Label htmlFor="refuse-reason">Refusal Reason *</Label>
          <Textarea
            id="refuse-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this request is refused..."
            className="mt-2"
            rows={4}
            disabled={isLoading}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Refusing...
              </>
            ) : (
              "Confirm Refusal"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
