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
import { Loader2, AlertCircle } from "lucide-react";

interface UserInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string) => Promise<void>;
  initialUserId?: string;
}

export function UserInviteModal({
  isOpen,
  onClose,
  onConfirm,
  initialUserId,
}: UserInviteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(initialUserId || "");
  const [error, setError] = useState<string | null>(null);

  // Update userId if initialUserId changes
  useEffect(() => {
    if (initialUserId) setUserId(initialUserId);
  }, [initialUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await onConfirm(userId.trim());
      setUserId("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setUserId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Enter the User ID to send an invitation email and change status to INVITED.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="userId">Internal User ID</Label>
            <Input
              id="userId"
              required
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isLoading}
            />
            {error && (
              <div className="flex items-center gap-2 text-red-700 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
