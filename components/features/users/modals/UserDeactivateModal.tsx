"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/features/users/types/users.types";
import { Loader2, AlertTriangle } from "lucide-react";

interface UserDeactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string) => Promise<void>;
  user: User | null;
}

export function UserDeactivateModal({
  isOpen,
  onClose,
  onConfirm,
  user,
}: UserDeactivateModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const isActive = user.status === "ACTIVE";

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(user.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-rose-600" />
          </div>
          <DialogTitle className="text-center">
            {isActive ? "Deactivate" : "Reactivate"} User
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to {isActive ? "deactivate" : "reactivate"}{" "}
            <strong>
              {user.first_name} {user.last_name}
            </strong>
            ?{isActive && " They will no longer be able to log in to the platform."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:justify-center pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              isActive ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
            }
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm {isActive ? "Deactivation" : "Reactivation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
