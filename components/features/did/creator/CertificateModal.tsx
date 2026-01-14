import React, { useState, useRef } from "react";
import { FileKey, X, Upload, CloudUpload, FileCheck } from "lucide-react";
// Forced HMR Refresh: 1
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VerificationMethod } from "@/lib/features/did/types";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (keys: VerificationMethod[]) => void;
}

export function CertificateModal({ isOpen, onClose, onUpload }: CertificateModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [certificateType, setCertificateType] = useState<"PEM" | "DER" | "P12" | "JWK">("PEM");
  const [password, setPassword] = useState("");
  const [extractedKeys, setExtractedKeys] = useState<VerificationMethod[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
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
      <DialogContent className="max-w-xl rounded-2xl border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-800">
              <FileKey className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Upload Certificate
              </DialogTitle>
              <p className="text-muted-foreground text-sm">
                Import keys from a certificate or key file.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Certificate Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(["PEM", "DER", "P12", "JWK"] as const).map((type) => {
                const isSelected = certificateType === type;
                return (
                  <Button
                    key={type}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setCertificateType(type)}
                    className={`h-11 font-bold transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md transform scale-[1.02]"
                        : "text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-900/20"
                    }`}
                  >
                    {type}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Certificate File
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer ${
                dragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-800 hover:bg-slate-50 dark:hover:bg-slate-900/30"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
            >
              <input
                placeholder="Upload File"
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pem,.der,.p12,.pfx,.jwk,.json"
                className="hidden"
              />

              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  file
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                    : "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                }`}
              >
                {file ? <FileCheck size={32} /> : <CloudUpload size={32} />}
              </div>

              <div className="text-center">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {file ? `${(file.size / 1024).toFixed(2)} KB` : "PEM, DER, P12, or JWK files"}
                </p>
              </div>

              {file && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setExtractedKeys([]);
                  }}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </div>

          {(certificateType === "P12" || certificateType === "DER") && (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Password (if encrypted)
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-11 border-slate-200 dark:border-slate-800 focus:ring-blue-500 rounded-lg"
              />
            </div>
          )}

          {extractedKeys.length > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 shadow-inner">
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
                <Upload size={16} />
                Extracted {extractedKeys.length} public key(s)
              </p>
              <div className="grid grid-cols-1 gap-2">
                {extractedKeys.map((key, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400"
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

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={extractedKeys.length === 0}
            className={`font-bold h-11 px-8 rounded-lg shadow-lg active:scale-95 transition-all ${
              extractedKeys.length > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400"
            }`}
          >
            Import Keys
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
