import { useState, useCallback } from "react";
import { didApiClient } from "../api/didApiClient";
import type { CertificateKey, CertificateType } from "../types/certificate.types";
import { getDefaultPurposes } from "../utils/purposeValidator";
import { logger } from "@/lib/shared/services/logger.service";

export interface UseCertificateUploadReturn {
  uploadCertificate: (
    organizationId: string,
    file: File,
    format: CertificateType,
    password?: string
  ) => Promise<CertificateKey | null>;
  isUploading: boolean;
  uploadError: string | null;
  clearError: () => void;
}

/**
 * Hook for certificate upload
 * Handles file upload and JWK extraction
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
      password?: string
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

        const response = await didApiClient.uploadCertificate(formData);

        // Auto-assign default purposes based on key type
        const defaultPurposes = getDefaultPurposes(response.didDocumentMetadata?.public_jwk);

        return {
          certificate_id: response.didDocumentMetadata?.certificate_id || "",
          key_id: `key-${Date.now()}`,
          extracted_jwk: response.didDocumentMetadata?.public_jwk || {},
          purposes: defaultPurposes,
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
