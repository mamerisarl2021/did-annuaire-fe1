import { useState, useCallback } from "react";
import { didService } from "../services/did.service";
import type { CertificateKey, CertificateType } from "../types/certificate.types";
import { logger } from "@/lib/shared/services/logger.service";

export interface UseCertificateUploadReturn {
  uploadCertificate: (
    organizationId: string,
    file: File,
    format: CertificateType,
    password?: string,
    certificateId?: string
  ) => Promise<CertificateKey | null>;
  isUploading: boolean;
  uploadError: string | null;
  clearError: () => void;
}

/**
 * Hook for certificate upload
 * Handles final certificate upload and persistence
 */
export function useCertificateUpload(): UseCertificateUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setUploadError(null);
  }, []);

  const uploadCertificate = useCallback(
    async (
      organizationId: string,
      file: File,
      format: CertificateType,
      password?: string,
      certificateId?: string
    ): Promise<CertificateKey | null> => {
      setIsUploading(true);
      setUploadError(null);

      try {
        const formData = new FormData();
        formData.append("organization_id", organizationId);
        formData.append("format", format);
        formData.append("file", file);
        if (password) {
          formData.append("password", password);
        }
        // If certificate_id is provided from preview, include it
        if (certificateId) {
          formData.append("certificate_id", certificateId);
        }

        logger.info("[useCertificateUpload] Uploading certificate for final persistence");
        const response = await didService.uploadCertificate(formData);

        return {
          certificate_id: response.didDocumentMetadata?.certificate_id || "",
          extracted_jwk: response.didDocumentMetadata?.public_jwk || {},
          purposes: ["authentication", "assertionMethod"],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Upload failed";
        logger.error("[useCertificateUpload] Upload failed:", message);
        setUploadError(message);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  return {
    uploadCertificate,
    isUploading,
    uploadError,
    clearError,
  };
}
