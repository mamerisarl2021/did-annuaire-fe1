import React from "react";
import { Input } from "@/components/ui/input";
import type { CertificateType } from "./CertificateTypeSelector";

interface CertificatePasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  certificateType: CertificateType;
}

export function CertificatePasswordInput({
  value,
  onChange,
  certificateType,
}: CertificatePasswordInputProps) {
  if (certificateType !== "PKCS12" && certificateType !== "DER") {
    return null;
  }

  return (
    <div className="space-y-3">
      <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
        Password (if encrypted)
      </label>
      <Input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter password"
        className="h-11 px-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-[3px] shadow-sm"
      />
    </div>
  );
}
