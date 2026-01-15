"use client";
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface JSONEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  height?: string;
}

export function JSONEditor({
  value,
  onChange,
  placeholder,
  label,
  error,
  height,
}: JSONEditorProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-slate-800 dark:text-slate-200 font-semibold block">{label}</label>
      )}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white dark:bg-slate-900 rounded p-4 font-mono text-sm text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 resize-none"
        style={{ height: height || "12rem" }}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
