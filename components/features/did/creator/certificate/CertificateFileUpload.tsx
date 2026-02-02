import React, { useRef, useState } from "react";
import { X, CloudUpload, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { CertificateType } from "@/lib/features/did/types/certificate.types";

interface CertificateFileUploadProps {
  file: File | null;
  certificateType: CertificateType;
  error: string;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

export function CertificateFileUpload({
  file,
  certificateType,
  error,
  onFileSelect,
  onFileRemove,
}: CertificateFileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getAcceptedFormats = () => {
    return certificateType ? ".pem" : ".pem,.der,.p12,.pfx,.p7b,.json";
  };

  const getHelpText = () => {
    if (file) {
      return `${(file.size / 1024).toFixed(2)} KB`;
    }
    return certificateType ? "Public key file (.pem) only" : "PEM, DER, PKCS7, or PKCS12 files";
  };

  return (
    <div className="space-y-3">
      <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
        Certificate file
      </label>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-[3px] p-8 transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer",
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-800 hover:bg-slate-50 dark:hover:bg-slate-900/30"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          title="upload file"
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={getAcceptedFormats()}
          className="hidden"
        />

        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            file
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
              : "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
          )}
        >
          {file ? <FileCheck size={24} /> : <CloudUpload size={24} />}
        </div>

        <div className="text-center">
          <p className="font-bold text-[14px] text-slate-900 dark:text-slate-100">
            {file ? file.name : "Click to upload or drag and drop"}
          </p>
          <p className="text-[12px] text-slate-400 mt-1">{getHelpText()}</p>
          {error && (
            <p className="text-[11px] font-bold text-red-500 mt-2 uppercase tracking-wider">
              {error}
            </p>
          )}
        </div>

        {file && (
          <button
            title="remove file"
            onClick={(e) => {
              e.stopPropagation();
              onFileRemove();
            }}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
