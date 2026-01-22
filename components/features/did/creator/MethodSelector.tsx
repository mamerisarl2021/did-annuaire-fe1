import React from "react";
import { ChevronDown } from "lucide-react";
import { MethodType } from "@/lib/features/did/types";
import { Button } from "@/components/ui/button";

interface MethodSelectorProps {
  selectedMethod: MethodType;
  onMethodSelect: (method: MethodType) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const methods: MethodType[] = ["WEB"];

export function MethodSelector({
  selectedMethod,
  onMethodSelect,
  isOpen,
  onOpenChange,
}: MethodSelectorProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      <button
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        className="flex items-center justify-between w-full text-left group"
      >
        <div>
          <h2 className="text-slate-900 dark:text-slate-100 font-bold text-lg">Method Selection</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Choose the decentralized identifier method for this DID.
          </p>
        </div>
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
          <ChevronDown
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""} text-slate-600 dark:text-slate-400`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {methods.map((method) => {
              const isSelected = selectedMethod === method;
              return (
                <Button
                  key={method}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => onMethodSelect(method)}
                  className={`h-11 font-bold transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md transform scale-[1.05]"
                      : "text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {method}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {!isOpen && selectedMethod && (
        <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg w-fit text-sm font-semibold border border-blue-100 dark:border-blue-800">
          Selected: {selectedMethod}
        </div>
      )}
    </div>
  );
}
