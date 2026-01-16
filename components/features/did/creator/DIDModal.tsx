"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DIDCreator } from "./DIDCreator";
import { DID } from "@/lib/features/did/types";
import { useDIDCreator } from "@/lib/features/did/hooks/useDIDCreator";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DIDModalProps {
  isOpen: boolean;
  onClose: () => void;
  did?: DID | null; // If provided, we are in edit mode
}

export function DIDModal({ isOpen, onClose, did }: DIDModalProps) {
  const creator = useDIDCreator();
  const { loadDID, resetCreator } = creator;

  useEffect(() => {
    if (isOpen) {
      if (did) {
        loadDID(did);
      } else {
        resetCreator();
      }
    }
  }, [isOpen, did, loadDID, resetCreator]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-6xl w-[95vw] max-h-[95vh] h-[95vh] overflow-hidden p-0 border-none bg-white dark:bg-slate-950 shadow-2xl flex flex-col !translate-y-[-50%]"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{did ? "Update DID" : "Create DID"}</DialogTitle>

        {/* Fixed Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 h-8 w-8 backdrop-blur-sm"
        >
          <X size={18} />
        </Button>

        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-950">
          <DIDCreator {...creator} isEditing={!!did} editingDidId={did?.id} onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
