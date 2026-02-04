import React from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface CertificateStatusFeedbackProps {
  isPreviewing: boolean;
  isUploading: boolean;
  previewError: string | null;
  uploadError: string | null;
  hasPreviewData: boolean;
}

/**
 * Displays status feedback for certificate operations
 * Shows loading states, errors, and success messages
 */
export function CertificateStatusFeedback({
  isPreviewing,
  isUploading,
  previewError,
  uploadError,
  hasPreviewData,
}: CertificateStatusFeedbackProps) {
  return (
    <>
      {/* Preview Loading */}
      {isPreviewing && (
        <div className="flex items-center justify-center p-4 text-blue-600">
          <Loader2 className="animate-spin mr-2" />
          <span>Validating certificate and extracting keys...</span>
        </div>
      )}

      {/* Upload Loading */}
      {isUploading && (
        <div className="flex items-center justify-center p-4 text-blue-600">
          <Loader2 className="animate-spin mr-2" />
          <span>Uploading certificate...</span>
        </div>
      )}

      {/* Preview Error */}
      {previewError && !isPreviewing && (
        <div className="flex items-start p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Preview failed</p>
            <p className="text-sm mt-1">{previewError}</p>
            <p className="text-sm mt-2 font-medium">Please check your file and try again.</p>
          </div>
        </div>
      )}

      {/* Upload Error */}
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

      {/* Success Message */}
      {hasPreviewData && !isPreviewing && !isUploading && !uploadError && (
        <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          <span>Certificate validated! Review the keys below and click Save to upload.</span>
        </div>
      )}
    </>
  );
}
