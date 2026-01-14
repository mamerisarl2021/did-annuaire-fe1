"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MethodType } from "@/lib/features/did/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DIDMethodSectionProps {
  selectedMethod: MethodType;
  onMethodSelect: (method: MethodType) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const methods: MethodType[] = [
  "BTCR2",
  "CHEQD",
  "EBSI",
  "ETHR",
  "INDY",
  "ION",
  "JWK",
  "KEY",
  "KSCIRC",
  "LING",
  "PKH",
  "V1",
  "WEB",
  "WEBVH",
];

export function DIDMethodSection({
  selectedMethod,
  onMethodSelect,
  isOpen,
  onOpenChange,
}: DIDMethodSectionProps) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800">
      <button
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-[#cbd5e1] dark:bg-slate-900 group transition-colors hover:bg-[#b0bdcc] dark:hover:bg-slate-800"
      >
        <span className="text-slate-700 dark:text-slate-300 font-bold text-[13px] uppercase tracking-wide">
          Select a method.
        </span>
        {isOpen ? (
          <ChevronUp className="size-5 text-slate-500" />
        ) : (
          <ChevronDown className="size-5 text-slate-500" />
        )}
      </button>

      {isOpen && (
        <div className="p-6 bg-[#cbd5e1]/50 dark:bg-slate-900/30 animate-in slide-in-from-top-1 duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {methods.map((method) => {
              const isSelected = selectedMethod === method;
              return (
                <Button
                  key={method}
                  type="button"
                  variant="secondary"
                  onClick={() => onMethodSelect(method)}
                  className={cn(
                    "h-11 font-bold text-xs rounded-md border-0 transition-all",
                    isSelected
                      ? "bg-[#64748b] text-white shadow-inner"
                      : "bg-[#94a3b8] text-slate-100 hover:bg-[#64748b]"
                  )}
                >
                  {method}
                </Button>
              );
            })}
          </div>
          <div className="mt-8 p-4 bg-white/50 dark:bg-slate-950/50 border border-white/60 dark:border-slate-800 rounded text-slate-500 dark:text-slate-400 text-xs font-medium">
            Select a method to see its description.
          </div>
        </div>
      )}
    </div>
  );
}
