import React, { useState } from "react";
import { FileKey, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { CertificateFileUpload } from "./certificate/CertificateFileUpload";
import { CertificatePasswordInput } from "./certificate/CertificatePasswordInput";
import { ExtractedKeysPreview } from "./certificate/ExtractedKeysPreview";
import { useCertificateUpload } from "@/lib/features/did/hooks/useCertificateUpload";
import { CertificateKey, CertificateType } from "@/lib/features/did/types/certificate.types";
import { VerificationMethod } from "@/lib/features/did/types";
import { CertificateTypeSelector } from "./certificate/CertificateTypeSelector";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (key: CertificateKey) => void;
  organizationId: string;
}

export function CertificateModal({
  isOpen,
  onClose,
  onUpload,
  organizationId,
}: CertificateModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [certificateType, setCertificateType] = useState<CertificateType>("PEM");
  const [password, setPassword] = useState("");

  // Use upload hook
  const { uploadCertificate, isUploading, uploadError, clearError } = useCertificateUpload();
  const [uploadedKey, setUploadedKey] = useState<CertificateKey | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    if (certificateType && !selectedFile.name.toLowerCase().endsWith(".pem")) {
    }

    setFile(selectedFile);
    clearError();
    setUploadedKey(null);

    // Immediate upload
    const result = await uploadCertificate(
      organizationId,
      selectedFile,
      certificateType as CertificateType,
      password
    );
    if (result) {
      setUploadedKey(result);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setUploadedKey(null);
    clearError();
  };

  const handleSave = () => {
    if (uploadedKey) {
      onUpload(uploadedKey);
      setFile(null);
      setUploadedKey(null);
      setPassword("");
      onClose();
    }
  };

  // Transform CertificateKey to VerificationMethod for preview
  const previewKeys: VerificationMethod[] = uploadedKey
    ? [
        {
          id: uploadedKey.certificate_id,
          type: "JsonWebKey2020",
          publicKeyJwk: uploadedKey.extracted_jwk,
        },
      ]
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[700px] p-0 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl rounded-lg"
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
            <CertificateTypeSelector value={certificateType} onChange={setCertificateType} />

            <CertificateFileUpload
              file={file}
              certificateType={certificateType}
              error={uploadError || ""}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
            />

            {/* Show loading state */}
            {isUploading && (
              <div className="flex items-center justify-center p-4 text-blue-600">
                <Loader2 className="animate-spin mr-2" />
                <span>Uploading and extracting keys...</span>
              </div>
            )}

            {/* Show error message */}
            {uploadError && !isUploading && (
              <div className="flex items-start p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Upload failed</p>
                  <p className="text-sm mt-1">{uploadError}</p>
                  {uploadError.includes("Authentication") && (
                    <p className="text-sm mt-2 font-medium">
                      Please try logging out and logging back in.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Show success message */}
            {uploadedKey && !isUploading && (
              <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                <span>Certificate uploaded successfully!</span>
              </div>
            )}

            <CertificatePasswordInput
              value={password}
              onChange={setPassword}
              certificateType={certificateType}
            />

            <ExtractedKeysPreview keys={previewKeys} />
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
              onClick={handleSave}
              disabled={!uploadedKey || isUploading}
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
