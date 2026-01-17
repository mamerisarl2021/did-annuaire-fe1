import React from "react";
import { Upload } from "lucide-react";
import { VerificationMethod } from "@/lib/features/did/types";

interface ExtractedKeysPreviewProps {
  keys: VerificationMethod[];
}

export function ExtractedKeysPreview({ keys }: ExtractedKeysPreviewProps) {
  if (keys.length === 0) {
    return null;
  }

  return (
    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 rounded-[3px] p-4 shadow-inner">
      <p className="text-[12px] font-bold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
        <Upload size={14} />
        Extracted {keys.length} public key(s)
      </p>
      <div className="grid grid-cols-1 gap-2">
        {keys.map((key, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-[11px] font-mono bg-white dark:bg-slate-900 p-2 rounded-[3px] border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-bold">{key.type}</span>
            <span className="opacity-60">({key.publicKeyJwk.crv || key.publicKeyJwk.kty})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
