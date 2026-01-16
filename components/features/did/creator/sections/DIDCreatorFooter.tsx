"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DIDCreatorFooterProps {
  onAction: () => void;
  isSubmitting: boolean;
  isEditing?: boolean;
  actionDisabled?: boolean;
  actionText?: string;
}

export function DIDCreatorFooter({
  onAction,
  isSubmitting,
  isEditing,
  actionDisabled,
  actionText,
}: DIDCreatorFooterProps) {
  const defaultText = isEditing ? "Update DID" : "Create DID";

  return (
    <div className="flex bg-[#0a0f18] dark:bg-black border-t border-slate-800 p-2">
      <button
        onClick={onAction}
        disabled={isSubmitting || actionDisabled}
        className={cn(
          "w-full min-h-[56px] py-4 rounded-md font-black text-sm uppercase tracking-[0.2em] transition-all border",
          actionDisabled
            ? "bg-[#1e293b]/50 text-red-500/80 cursor-not-allowed border-slate-800"
            : "bg-[#1e293b]/80 hover:bg-[#2c3e50] text-[#3b82f6] border-[#3b82f6]/40 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]"
        )}
      >
        <span className="flex items-center justify-center gap-2">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {actionText || defaultText}
        </span>
      </button>
    </div>
  );
}
