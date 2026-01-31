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
import { CheckCircle, AlertCircle } from "lucide-react";

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note?: string) => Promise<void>;
  request: PublishRequest | null;
}

export function ApproveModal({ isOpen, onClose, onConfirm, request }: ApproveModalProps) {
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
    if (feedback?.type === "success") {
      onClose();
      // Delay reset to avoid flicker if re-opened quickly (though typically instance based)
      setTimeout(resetState, 300);
    } else {
      onClose();
      resetState();
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await onConfirm(note.trim() || undefined);
      setFeedback({ type: "success", message: "Publish request approved successfully." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to approve request",
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
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl mb-2">Approved!</DialogTitle>
            <DialogDescription className="text-center mb-6">{feedback.message}</DialogDescription>
            <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Approve Publish Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this publish request?
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
                  <Label htmlFor="note">Note (optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Add a note about this approval..."
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
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Approving..." : "Approve"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
