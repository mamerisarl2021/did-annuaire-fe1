"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIDMode } from "@/lib/features/did/types";

interface DIDCreatorFooterProps {
  onCompile: () => void;
  onAction: () => void;
  isSubmitting: boolean;
  isCompiled: boolean;
  mode: DIDMode;
  canCompile?: boolean;
}

export function DIDCreatorFooter({
  onCompile,
  onAction,
  isSubmitting,
  isCompiled,
  mode,
  canCompile = true,
}: DIDCreatorFooterProps) {
  if (mode === "resolve") return null;

  const isUpdate = mode === "update";
  const actionText = isUpdate ? "Update DID" : "Create DID";

  return (
    <div className="flex bg-[#0a0f18] dark:bg-black border-t border-slate-800 p-3 gap-3">
      {/* 🔵 Compile DID Button */}
      <button
        type="button"
        onClick={onCompile}
        disabled={isSubmitting || !canCompile}
        className={cn(
          "flex-1 min-h-[56px] py-4 rounded-md font-black text-xs uppercase tracking-[0.2em] transition-all border",
          !canCompile
            ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50 border-slate-700"
            : "bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border-blue-500/40 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]",
          isSubmitting && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className="flex items-center justify-center gap-2">
          {isSubmitting && !isCompiled ? <Loader2 className="size-4 animate-spin" /> : null}
          Compile DID
        </span>
      </button>

      {/* 🟢/🟡 Create or Update Button */}
      <button
        type="button"
        onClick={onAction}
        disabled={isSubmitting || !isCompiled}
        className={cn(
          "flex-1 min-h-[56px] py-4 rounded-md font-black text-xs uppercase tracking-[0.2em] transition-all",
          !isCompiled
            ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50 border-slate-700"
            : isUpdate
              ? "bg-yellow-600 hover:bg-yellow-700 text-black border-yellow-700 shadow-[0_0_20px_rgba(234,179,8,0.2)]"
              : "bg-green-600 hover:bg-green-700 text-white border-green-700 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
        )}
      >
        <span className="flex items-center justify-center gap-2">
          {isSubmitting && isCompiled ? <Loader2 className="size-4 animate-spin" /> : null}
          {actionText}
        </span>
      </button>
    </div>
  );
}
