import { useState, useCallback } from "react";
import { didService } from "../services/did.service";
import type { CertificateType } from "../types/certificate.types";
import type { PreviewCertificateResponse } from "../types/api.types";
import { logger } from "@/lib/shared/services/logger.service";

/**
 * Preview data extracted from certificate
 */
export interface CertificatePreviewData {
  certificate_id: string;
  public_jwk: {
    kty: string;
    crv?: string;
    x?: string;
    y?: string;
    n?: string;
    e?: string;
    [key: string]: unknown;
  };
  fingerprint: string;
}

export interface UseCertificatePreviewReturn {
  previewCertificate: (
    organizationId: string,
    file: File,
    format: CertificateType,
    password?: string
  ) => Promise<CertificatePreviewData | null>;
  isPreviewing: boolean;
  previewError: string | null;
  previewData: CertificatePreviewData | null;
  clearPreview: () => void;
}

/**
 * Hook for certificate preview
 * Handles file validation and JWK extraction without persisting the certificate
 */
export function useCertificatePreview(): UseCertificatePreviewReturn {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<CertificatePreviewData | null>(null);

  const clearPreview = useCallback(() => {
    setPreviewError(null);
    setPreviewData(null);
  }, []);

  const previewCertificate = useCallback(
    async (
      organizationId: string,
      file: File,
      format: CertificateType,
      password?: string
    ): Promise<CertificatePreviewData | null> => {
      setIsPreviewing(true);
      setPreviewError(null);
      setPreviewData(null);

      try {
        const formData = new FormData();
        formData.append("organization_id", organizationId);
        formData.append("format", format);
        formData.append("file", file);
        if (password) {
          formData.append("password", password);
        }

        logger.info("[useCertificatePreview] Calling previewCertificate API");
        const response: PreviewCertificateResponse = await didService.previewCertificate(formData);

        const data: CertificatePreviewData = {
          certificate_id: response.didDocumentMetadata?.certificate_id || "",
          public_jwk: response.didDocumentMetadata?.public_jwk || {},
          fingerprint: response.didDocumentMetadata?.fingerprint || "",
        };

        setPreviewData(data);
        logger.info("[useCertificatePreview] Preview successful", {
          certificate_id: data.certificate_id,
        });
        return data;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Preview failed";
        logger.error("[useCertificatePreview] Preview failed:", message);
        setPreviewError(message);
        return null;
      } finally {
        setIsPreviewing(false);
      }
    },
    []
  );

  return {
    previewCertificate,
    isPreviewing,
    previewError,
    previewData,
    clearPreview,
  };
}
