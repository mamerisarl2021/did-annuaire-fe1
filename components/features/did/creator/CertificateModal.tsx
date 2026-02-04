import React from "react";
import { FileKey, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { CertificateFileUpload } from "./certificate/CertificateFileUpload";
import { CertificatePasswordInput } from "./certificate/CertificatePasswordInput";
import { ExtractedKeysPreview } from "./certificate/ExtractedKeysPreview";
import { CertificateTypeSelector } from "./certificate/CertificateTypeSelector";
import { CertificateStatusFeedback } from "./certificate/CertificateStatusFeedback";
import { useCertificateModal } from "@/lib/features/did/hooks/useCertificateModal";
import type { CertificateKey } from "@/lib/features/did/types/certificate.types";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (key: CertificateKey) => void;
  organizationId: string;
}

/**
 * Certificate upload modal - Pure presentational component
 * All business logic is handled by useCertificateModal hook
 */
export function CertificateModal({
  isOpen,
  onClose,
  onUpload,
  organizationId,
}: CertificateModalProps) {
  const {
    // State
    file,
    certificateType,
    password,

    // Computed state
    previewKeys,
    canSave,
    isLoading,

    // Preview state
    isPreviewing,
    previewError,
    previewData,

    // Upload state
    isUploading,
    uploadError,

    // Actions
    setCertificateType,
    setPassword,
    handleFileSelect,
    handleFileRemove,
    handleSave,
  } = useCertificateModal({ organizationId, onUpload, onClose });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[700px] p-0 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl rounded-lg"
      >
        <div className="bg-white dark:bg-slate-950 p-8 space-y-8">
          {/* Header */}
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

          {/* Form Content */}
          <div className="space-y-6">
            <CertificateTypeSelector value={certificateType} onChange={setCertificateType} />

            <CertificateFileUpload
              file={file}
              certificateType={certificateType}
              error={previewError || uploadError || ""}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
            />

            <CertificateStatusFeedback
              isPreviewing={isPreviewing}
              isUploading={isUploading}
              previewError={previewError}
              uploadError={uploadError}
              hasPreviewData={!!previewData}
            />

            <CertificatePasswordInput
              value={password}
              onChange={setPassword}
              certificateType={certificateType}
            />

            <ExtractedKeysPreview keys={previewKeys} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="font-medium text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 px-6 h-10 rounded-[3px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!canSave}
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
