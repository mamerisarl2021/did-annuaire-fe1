"use client";

// Forced HMR Refresh: 1
import React from "react";
import { LayoutGrid, Globe, Shield, MessageSquare, Trash2 } from "lucide-react";
import { JSONEditor } from "../JSONEditor";
import { Service } from "@/lib/features/did/types";

interface DIDDocumentSectionProps {
  didDocument: string;
  services?: Service[];
  onDocumentChange: (doc: string) => void;
  onAddService: () => void;
  onRemoveService?: (id: string) => void;
}

export function DIDDocumentSection({
  didDocument,
  services = [],
  onDocumentChange,
  onAddService,
  onRemoveService,
}: DIDDocumentSectionProps) {
  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] dark:bg-slate-900/5 h-full border-b border-slate-200 dark:border-slate-800">
      <div className="space-y-4">
        <label className="text-slate-700 dark:text-slate-300 font-bold text-sm block ml-1">
          DID Document
        </label>
        <div className="bg-white dark:bg-slate-950 rounded border border-slate-300 dark:border-slate-800 shadow-inner overflow-hidden">
          <JSONEditor value={didDocument} onChange={onDocumentChange} height="400px" />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-slate-700 dark:text-slate-300 font-bold text-sm block ml-1 uppercase tracking-wider text-[11px]">
          Services
        </label>
        <div className="flex flex-wrap gap-4">
          {/* Visual Service Cards */}
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col items-center justify-center gap-2 w-40 h-28 border border-white dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 shadow-sm relative group"
            >
              <div className="size-8 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-800">
                {service.type === "LinkedDomains" ? (
                  <Globe className="size-4 text-slate-500" />
                ) : service.type === "DIDCommMessaging" ? (
                  <MessageSquare className="size-4 text-slate-500" />
                ) : (
                  <Shield className="size-4 text-slate-500" />
                )}
              </div>
              <span className="text-slate-800 dark:text-slate-200 font-bold text-[10px] truncate max-w-[80%] uppercase tracking-tight">
                {service.id.replace(/^#/, "")}
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-[9px] font-medium">
                {service.type}
              </span>

              {onRemoveService && (
                <button
                  title="remove service"
                  onClick={() => onRemoveService(service.id)}
                  className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}

          {/* Add Service Button */}
          <button
            onClick={onAddService}
            className="flex flex-col items-center justify-center gap-3 w-40 h-28 border border-slate-400 dark:border-slate-700 rounded-md bg-[#cbd5e1]/40 dark:bg-slate-800/40 hover:bg-[#b0bdcc] dark:hover:bg-slate-700 transition-colors group"
          >
            <div className="flex items-center justify-center relative size-8">
              <LayoutGrid className="size-full text-slate-800 dark:text-slate-200" />
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 border border-slate-400">
                <DIDPlusIcon className="size-2 text-slate-800 dark:text-slate-200" />
              </div>
            </div>
            <span className="text-slate-800 dark:text-slate-200 font-bold text-[10px] uppercase tracking-wider">
              Add Service
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function DIDPlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
