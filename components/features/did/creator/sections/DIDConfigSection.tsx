"use client";

import React from "react";
import { JSONEditor } from "../JSONEditor";

interface DIDConfigSectionProps {
  options: string;
  onOptionsChange: (options: string) => void;
  secret: string;
  onSecretChange: (secret: string) => void;
  isEditing?: boolean;
}

export function DIDConfigSection({
  options,
  onOptionsChange,
  secret,
  onSecretChange,
  isEditing,
}: DIDConfigSectionProps) {
  const prefix = isEditing ? "Update" : "Create";

  return (
    <div className="p-8 bg-[#f8fafc] dark:bg-slate-900/5 grid grid-cols-1 lg:grid-cols-2 gap-8 border-b border-slate-200 dark:border-slate-800">
      <div className="space-y-4">
        <label className="text-slate-700 dark:text-slate-300 font-bold text-sm block">
          {prefix} DID: Options
        </label>
        <div className="bg-white dark:bg-slate-950 rounded border border-slate-300 dark:border-slate-800 shadow-inner overflow-hidden">
          <JSONEditor value={options} onChange={onOptionsChange} height="250px" />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-slate-700 dark:text-slate-300 font-bold text-sm block">
          {prefix} DID: Secret
        </label>
        <div className="bg-white dark:bg-slate-950 rounded border border-slate-300 dark:border-slate-800 shadow-inner overflow-hidden">
          <JSONEditor value={secret} onChange={onSecretChange} height="250px" />
        </div>
      </div>
    </div>
  );
}
