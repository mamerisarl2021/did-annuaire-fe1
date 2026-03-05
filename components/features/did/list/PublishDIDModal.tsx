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
import { QrCode } from "lucide-react";
import { DID } from "@/lib/features/did/types";

interface PublishDIDModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (did: DID) => void;
  did: DID | null;
}

export function PublishDIDModal({ isOpen, onClose, onConfirm, did }: PublishDIDModalProps) {
  if (!did) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-sm p-0 overflow-hidden border-none shadow-2xl">
        <div className="p-6 pt-8">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-full">
              <QrCode className="size-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-4 flex-1">
              <DialogHeader className="p-0 text-left">
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Publier le DID
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400">
                  Vous êtes sur le point de publier le DID suivant sur le réseau de production :
                </p>

                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-lg">
                  <code className="text-sm font-mono text-slate-800 dark:text-slate-200 break-all leading-relaxed">
                    {did.id}
                  </code>
                </div>

                <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                  Assurez-vous que le document est finalisé avant de publier.
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
            Annuler
          </Button>
          <Button
            onClick={() => onConfirm(did)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 shadow-emerald-500/20 shadow-lg"
          >
            Publier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
