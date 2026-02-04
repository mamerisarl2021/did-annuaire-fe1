import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CertificateType } from "@/lib/features/did/types/certificate.types";

interface CertificateTypeSelectorProps {
  value: CertificateType;
  onChange: (value: CertificateType) => void;
}

export function CertificateTypeSelector({ value, onChange }: CertificateTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
        Certificate type
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as CertificateType)}>
        <SelectTrigger className="w-full h-11 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-[3px] shadow-sm font-medium">
          <SelectValue placeholder="Select certificate type" />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="PEM">PEM</SelectItem>
          <SelectItem value="DER">DER</SelectItem>
          <SelectItem value="PKCS7">PKCS7</SelectItem>
          <SelectItem value="PKCS12">PKCS12</SelectItem>
          <SelectItem value="CRT">CRT</SelectItem> */}
          <SelectItem value="AUTO">AUTO</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
