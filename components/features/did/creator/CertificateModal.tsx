import React, { useState, useRef } from "react";
import { FileKey, X, Upload, CloudUpload, FileCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VerificationMethod } from "@/lib/features/did/types";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (keys: VerificationMethod[]) => void;
}

export function CertificateModal({ isOpen, onClose, onUpload }: CertificateModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [certificateType, setCertificateType] = useState<
    "PEM" | "DER" | "PKCS7" | "PKCS12" | "JWK"
  >("PEM");
  const [password, setPassword] = useState("");
  const [extractedKeys, setExtractedKeys] = useState<VerificationMethod[]>([]);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (certificateType === "JWK" && !selectedFile.name.toLowerCase().endsWith(".pem")) {
      setError("JWK requires a .pem public key file.");
      setFile(null);
      return;
    }
    setError("");
    setFile(selectedFile);
    simulateKeyExtraction();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const simulateKeyExtraction = () => {
    const mockKeys = [
      {
        id: "#key-0",
        type: "JsonWebKey2020",
        publicKeyJwk: {
          kty: "OKP",
          crv: "Ed25519",
          x: "0-e2i2_Ua1S5HbTYnVB0lj2Z2ytXu2-tYmDFf8f5NjU",
        },
      },
      {
        id: "#key-1",
        type: "JsonWebKey2020",
        publicKeyJwk: {
          kty: "OKP",
          crv: "X25519",
          x: "9GXjPGGvmRq9F6Ng5dQQ_s31mfhxrcNZxRGONrmH30k",
        },
      },
    ];
    setExtractedKeys(mockKeys);
  };

  const handleUpload = () => {
    if (extractedKeys.length > 0) {
      onUpload(extractedKeys);
      setFile(null);
      setExtractedKeys([]);
      setPassword("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[700px] p-0 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl rounded-lg"
      >
        <div className="bg-white dark:bg-slate-950 p-8 space-y-8">
          <DialogHeader className="flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#e0f2fe] dark:bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-100 dark:border-blue-800">
                <FileKey className="text-blue-600 dark:text-blue-400 size-5" />
              </div>
              <DialogTitle className="text-xl font-bold text-[#1e293b] dark:text-slate-100">
                Add Certificate
              </DialogTitle>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1"
              title="close dialog"
            >
              <X size={20} />
            </button>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                Certificate type
              </label>
              <Select
                value={certificateType}
                onValueChange={(value) => setCertificateType(value as any)}
              >
                <SelectTrigger className="w-full h-11 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-[3px] shadow-sm font-medium">
                  <SelectValue placeholder="Select certificate type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PEM">PEM</SelectItem>
                  <SelectItem value="DER">DER</SelectItem>
                  <SelectItem value="PKCS7">PKCS7</SelectItem>
                  <SelectItem value="PKCS12">PKCS12</SelectItem>
                  <SelectItem value="JWK">JWK</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  accept={certificateType === "JWK" ? ".pem" : ".pem,.der,.p12,.pfx,.p7b,.json"}
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
                  <p className="text-[12px] text-slate-400 mt-1">
                    {file
                      ? `${(file.size / 1024).toFixed(2)} KB`
                      : certificateType === "JWK"
                        ? "Public key file (.pem) only"
                        : "PEM, DER, PKCS7, or PKCS12 files"}
                  </p>
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
                      setFile(null);
                      setExtractedKeys([]);
                    }}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {(certificateType === "PKCS12" || certificateType === "DER") && (
              <div className="space-y-3">
                <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                  Password (if encrypted)
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="h-11 px-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-[3px] shadow-sm"
                />
              </div>
            )}

            {extractedKeys.length > 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 rounded-[3px] p-4 shadow-inner">
                <p className="text-[12px] font-bold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
                  <Upload size={14} />
                  Extracted {extractedKeys.length} public key(s)
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {extractedKeys.map((key, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-[11px] font-mono bg-white dark:bg-slate-900 p-2 rounded-[3px] border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="font-bold">{key.type}</span>
                      <span className="opacity-60">
                        ({key.publicKeyJwk.crv || key.publicKeyJwk.kty})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="font-medium text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 px-6 h-10 rounded-[3px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={extractedKeys.length === 0}
              className="bg-white hover:bg-slate-50 text-slate-800 font-medium border border-slate-300 dark:border-slate-700 px-6 h-10 rounded-[3px]"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
