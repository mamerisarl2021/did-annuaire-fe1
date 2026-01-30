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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PublishRequest } from "../types/publish-request.types";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note?: string) => Promise<void>;
  request: PublishRequest | null;
}

export function RejectModal({ isOpen, onClose, onConfirm, request }: RejectModalProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(note.trim() || undefined);
      setNote("");
      onClose();
    } catch (error) {
      console.error("Reject error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Publish Request</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject this publish request?
          </DialogDescription>
        </DialogHeader>

        {request && (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">DID: {request.did}</p>
              <p className="text-muted-foreground">Version: {request.version}</p>
              <p className="text-muted-foreground">Environment: {request.environment}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Reason (optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a reason for this rejection..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? "Rejecting..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
