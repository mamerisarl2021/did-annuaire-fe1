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
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  const [userId, setUserId] = useState(initialUserId || "");

  useEffect(() => {
    if (initialUserId) setUserId(initialUserId);
  }, [initialUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;
    setIsLoading(true);
    try {
      await onConfirm(userId);
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to resend invitation",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
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
              onChange={(e) => setUserId(e.target.value)}
              className={initialUserId ? "bg-slate-50" : ""}
            />
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
