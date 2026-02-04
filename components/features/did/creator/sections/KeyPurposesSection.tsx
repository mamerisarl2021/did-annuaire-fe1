"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { OptionKey } from "@/lib/features/did/types";
import { cn } from "@/lib/utils";

interface KeyPurposesSectionProps {
  selectedPurposes: OptionKey[];
  onTogglePurpose: (purpose: OptionKey) => void;
  disabled?: boolean;
  allowedPurposes?: OptionKey[] | null;
}

const PURPOSES: { key: OptionKey; label: string; description: string }[] = [
  {
    key: "authentication",
    label: "Authentication",
    description: "Used to authenticate as the DID subject.",
  },
  {
    key: "assertionMethod",
    label: "Assertion",
    description: "Used to sign claims or verifiable credentials.",
  },
  {
    key: "keyAgreement",
    label: "Key Agreement",
    description: "Used for encrypted communication/key exchange.",
  },
  {
    key: "capabilityInvocation",
    label: "Invocation",
    description: "Used to invoke authorization capabilities.",
  },
  {
    key: "capabilityDelegation",
    label: "Delegation",
    description: "Used to delegate authorization capabilities.",
  },
];

export function KeyPurposesSection({
  selectedPurposes,
  onTogglePurpose,
  disabled,
  allowedPurposes,
}: KeyPurposesSectionProps) {
  const visiblePurposes = allowedPurposes
    ? PURPOSES.filter((p) => allowedPurposes.includes(p.key))
    : PURPOSES;

  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 border-l-4 border-yellow-600 pl-4">
          Key Purposes
        </h3>
        {allowedPurposes && (
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
            Filtered by Certificate
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visiblePurposes.map((purpose) => {
          const isSelected = selectedPurposes.includes(purpose.key);
          return (
            <div
              key={purpose.key}
              role="button"
              tabIndex={disabled ? -1 : 0}
              onClick={() => !disabled && onTogglePurpose(purpose.key)}
              onKeyDown={(e) => {
                if (!disabled && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onTogglePurpose(purpose.key);
                }
              }}
              className={cn(
                "flex flex-col items-start p-5 rounded-xl border-2 transition-all text-left group gap-3 outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                isSelected
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg shadow-blue-500/10"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-blue-400 dark:hover:border-blue-600",
                disabled ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={cn(
                    "text-[13px] font-black uppercase tracking-wider",
                    isSelected
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-slate-700 dark:text-slate-300"
                  )}
                >
                  {purpose.label}
                </span>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onTogglePurpose(purpose.key)}
                  disabled={disabled}
                  className={cn(
                    "size-5 border-2 rounded-full",
                    isSelected
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300 dark:border-slate-700"
                  )}
                />
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                {purpose.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
