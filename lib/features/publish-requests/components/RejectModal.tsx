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
import { AlertCircle, XCircle } from "lucide-react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note?: string) => Promise<void>;
  request: PublishRequest | null;
}

export function RejectModal({ isOpen, onClose, onConfirm, request }: RejectModalProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const resetState = () => {
    setNote("");
    setFeedback(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    onClose();
    if (feedback?.type === "success") setTimeout(resetState, 300);
    else resetState();
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await onConfirm(note.trim() || undefined);
      setFeedback({ type: "success", message: "Publish request rejected." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to reject request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-full max-w-sm">
        {feedback?.type === "success" ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl mb-2">Rejected</DialogTitle>
            <DialogDescription className="text-center mb-6">{feedback.message}</DialogDescription>
            <Button onClick={handleClose} className="w-full bg-slate-600 hover:bg-slate-700">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Reject Publish Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject this publish request?
              </DialogDescription>
            </DialogHeader>

            {feedback?.type === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2 text-red-800 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{feedback.message}</span>
              </div>
            )}

            {request && (
              <div className="space-y-4 py-2">
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
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
