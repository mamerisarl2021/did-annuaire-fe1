"use client";

import React from "react";
import { LayoutGrid, X } from "lucide-react";
import { JSONEditor } from "../JSONEditor";
import { Service } from "@/lib/features/did/types";
import { CertificateKey } from "@/lib/features/did/types/certificate.types";

interface DIDDocumentSectionProps {
  didDocument: string;
  services?: Service[];
  certificateKey: CertificateKey | null;
  onDocumentChange: (doc: string) => void;
  onAddService: () => void;
  onRemoveService?: (id: string) => void;
  onAddCertificate: () => void;
  onRemoveCertificate: () => void;
}

export function DIDDocumentSection({
  didDocument,
  services = [],
  certificateKey,
  onDocumentChange,
  onAddService,
  onRemoveService,
  onAddCertificate,
  onRemoveCertificate,
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
          Resources
        </label>
        <div className="flex flex-wrap gap-4">
          {/* Visual Service Cards */}
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col p-4 w-48 h-32 border border-slate-300 dark:border-slate-700 rounded-md bg-[#cbd5e1]/50 dark:bg-slate-800 shadow-sm relative group"
            >
              <div className="space-y-1 overflow-hidden">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Type:
                  </p>
                  <p className="text-[12px] font-mono font-bold text-slate-700 dark:text-slate-200 truncate">
                    {service.type}
                  </p>
                </div>

                <div className="space-y-0.5 pt-1">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Service endpoint:
                  </p>
                  <p className="text-[12px] font-mono font-bold text-slate-700 dark:text-slate-200 truncate">
                    {typeof service.serviceEndpoint === "string"
                      ? service.serviceEndpoint
                      : JSON.stringify(service.serviceEndpoint)}
                  </p>
                </div>
              </div>

              {onRemoveService && (
                <button
                  title="remove service"
                  onClick={() => onRemoveService(service.id)}
                  className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}

          {/* Individual Certificate Card */}
          {certificateKey && (
            <div className="flex flex-col p-4 w-48 h-32 border border-blue-200 dark:border-blue-900/50 rounded-md bg-blue-50/50 dark:bg-blue-900/10 shadow-sm relative group">
              <div className="space-y-1 overflow-hidden">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-blue-500 dark:text-blue-400">
                    Certificate Key:
                  </p>
                  <p className="text-[12px] font-mono font-bold text-blue-700 dark:text-blue-200 truncate">
                    {certificateKey.certificate_id}
                  </p>
                </div>

                <div className="space-y-0.5 pt-1">
                  <p className="text-[11px] font-medium text-blue-500 dark:text-blue-400">
                    JWK Extraction:
                  </p>
                  <p className="text-[12px] font-mono font-bold text-blue-700 dark:text-blue-200 truncate italic">
                    {certificateKey.extracted_jwk.kty} (
                    {certificateKey.extracted_jwk.crv || certificateKey.extracted_jwk.n
                      ? "Public"
                      : "Private"}
                    )
                  </p>
                </div>
              </div>

              <button
                title="remove certificate"
                onClick={onRemoveCertificate}
                className="absolute top-2 right-2 p-1 text-blue-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

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

          {/* Add Certificate Button - Only if no certificate yet */}
          {!certificateKey && (
            <button
              onClick={onAddCertificate}
              className="flex flex-col items-center justify-center gap-3 w-40 h-28 border border-slate-400 dark:border-slate-700 rounded-md bg-[#cbd5e1]/40 dark:bg-slate-800/40 hover:bg-[#b0bdcc] dark:hover:bg-slate-700 transition-colors group cursor-pointer"
            >
              <div className="flex items-center justify-center relative size-8">
                <svg
                  className="size-full text-slate-800 dark:text-slate-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="M9 15h6" />
                </svg>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 border border-slate-400">
                  <DIDPlusIcon className="size-2 text-slate-800 dark:text-slate-200" />
                </div>
              </div>
              <span className="text-slate-800 dark:text-slate-200 font-bold text-[10px] uppercase tracking-wider">
                Add Certificate
              </span>
            </button>
          )}
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
