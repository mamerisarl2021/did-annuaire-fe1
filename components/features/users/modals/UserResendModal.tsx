"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";

interface UserResendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string) => Promise<void>;
  userId?: string;
}

export function UserResendModal({
  isOpen,
  onClose,
  onConfirm,
  userId: initialUserId,
}: UserResendModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [internalUserId, setInternalUserId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const userId = initialUserId || internalUserId;

  // Reset internal state on modal close
  useEffect(() => {
    if (!isOpen) {
      setInternalUserId("");
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await onConfirm(userId.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend invitation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
            <RefreshCw className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center">Resend Invitation</DialogTitle>
          <DialogDescription className="text-center">
            Confirm the User ID to resend the activation email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4 text-center">
          <div className="space-y-2 text-left">
            <Label htmlFor="resend_userId">Confirmed User ID</Label>
            <Input
              id="resend_userId"
              required
              readOnly={!!initialUserId}
              value={userId}
              onChange={(e) => setInternalUserId(e.target.value)}
              className={initialUserId ? "bg-slate-50" : ""}
              disabled={isLoading}
            />
            {error && (
              <div className="flex items-center gap-2 text-red-700 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2 sm:justify-center">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resend Now
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
