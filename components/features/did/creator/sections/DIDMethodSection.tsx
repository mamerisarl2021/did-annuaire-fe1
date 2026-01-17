"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { DIDMode } from "@/lib/features/did/types";

interface DIDMethodSectionProps {
  logicalIdentifier: string;
  onLogicalIdentifierChange: (id: string) => void;
  mode: DIDMode;
}

const METHOD_DESCRIPTIONS = {
  WEB: "DID:WEB is a popular DID method that only requires DNS and web servers. It supports full DID document extensibility, but has drawbacks with regard to decentralization and verifiability.",
};

export function DIDMethodSection({
  logicalIdentifier,
  onLogicalIdentifierChange,
  mode,
}: DIDMethodSectionProps) {
  const isReadOnly = mode === "resolve";

  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-8 py-6 space-y-6">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 border-l-4 border-blue-600 pl-4">
          DID Discovery
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              DID Method
            </label>
            <div className="h-12 px-4 flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md font-mono text-sm text-slate-600 dark:text-slate-400 cursor-not-allowed">
              did:web
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Statically fixed to did:web for this system.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Logical Identifier
            </label>
            <Input
              value={logicalIdentifier}
              onChange={(e) => onLogicalIdentifierChange(e.target.value)}
              placeholder="eg: permis_qrcode"
              disabled={isReadOnly}
              className="h-12 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 rounded-md font-medium text-slate-900 dark:text-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <p className="text-[10px] text-slate-500 font-medium">
              The domain or path where the DID document will be hosted.
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-lg text-blue-700/80 dark:text-blue-400/80 text-xs font-medium leading-relaxed">
          {METHOD_DESCRIPTIONS.WEB}
        </div>
      </div>
    </div>
  );
}
