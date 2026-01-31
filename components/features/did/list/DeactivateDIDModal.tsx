"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { DID } from "@/lib/features/did/types";

interface DeactivateDIDModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (did: DID) => void;
  did: DID | null;
}

export function DeactivateDIDModal({ isOpen, onClose, onConfirm, did }: DeactivateDIDModalProps) {
  if (!did) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-sm p-0 overflow-hidden border-none shadow-2xl">
        <div className="p-6 pt-8">
          <div className="flex items-start gap-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full">
              <AlertCircle className="size-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-4 flex-1">
              <DialogHeader className="p-0 text-left">
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Deactivate DID
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400">
                  Are you sure you want to deactivate
                </p>

                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-lg">
                  <code className="text-sm font-mono text-slate-800 dark:text-slate-200 break-all leading-relaxed">
                    {did.id}
                  </code>
                </div>

                <p className="text-red-600 dark:text-red-400 font-medium text-lg">
                  This operation cannot be undone!
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-row items-center justify-end gap-3 sm:space-x-0">
          <Button
            variant="ghost"
            onClick={onClose}
            className="font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(did)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 shadow-red-500/20 shadow-lg"
          >
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
