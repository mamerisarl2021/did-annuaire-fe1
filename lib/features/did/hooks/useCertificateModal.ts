import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useCertificatePreview } from "./useCertificatePreview";
import { useCertificateUpload } from "./useCertificateUpload";
import type { CertificateKey, CertificateType } from "../types/certificate.types";
import type { VerificationMethod } from "../types";

interface UseCertificateModalProps {
  organizationId: string;
  onUpload: (key: CertificateKey) => void;
  onClose: () => void;
}

interface UseCertificateModalReturn {
  // State
  file: File | null;
  certificateType: CertificateType;
  password: string;

  // Computed state
  previewKeys: VerificationMethod[];
  canSave: boolean;
  isLoading: boolean;
  hasError: boolean;

  // Preview state
  isPreviewing: boolean;
  previewError: string | null;
  previewData: ReturnType<typeof useCertificatePreview>["previewData"];

  // Upload state
  isUploading: boolean;
  uploadError: string | null;

  // Actions
  setCertificateType: (type: CertificateType) => void;
  setPassword: (password: string) => void;
  handleFileSelect: (file: File) => Promise<void>;
  handleFileRemove: () => void;
  handleSave: () => Promise<void>;
}

/**
 * Hook for CertificateModal business logic
 * Handles all state management, validation, and workflow orchestration
 */
export function useCertificateModal({
  organizationId,
  onUpload,
  onClose,
}: UseCertificateModalProps): UseCertificateModalReturn {
  const [file, setFile] = useState<File | null>(null);
  const [certificateType, setCertificateType] = useState<CertificateType>("AUTO");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  // Preview hook - called on file selection
  const { previewCertificate, isPreviewing, previewError, previewData, clearPreview } =
    useCertificatePreview();

  // Upload hook - called on Save button click
  const { uploadCertificate, isUploading, uploadError, clearError } = useCertificateUpload();

  /**
   * Validates file extension based on certificate type
   */
  const validateFileExtension = useCallback(
    (fileName: string): boolean => {
      const lowerFileName = fileName.toLowerCase();
      let allowedExtensions: string[] = [];

      switch (certificateType) {
        case "AUTO":
          allowedExtensions = [];
          break;
        // Add other cases as needed
      }

      if (allowedExtensions.length === 0) {
        return true; // No validation needed for AUTO
      }

      const isValid = allowedExtensions.some((ext) => lowerFileName.endsWith(ext));

      if (!isValid) {
        toast({
          title: "Invalid file format",
          description: `Please select a ${certificateType} file with extension: ${allowedExtensions.join(" or ")}.`,
          variant: "destructive",
        });
      }

      return isValid;
    },
    [certificateType, toast]
  );

  /**
   * Handles file selection and triggers preview
   */
  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      // Validate file extension
      if (!validateFileExtension(selectedFile.name)) {
        return;
      }

      setFile(selectedFile);
      clearPreview();
      clearError();

      // Step 1: Preview the certificate (validation + extraction)
      const previewResult = await previewCertificate(
        organizationId,
        selectedFile,
        certificateType,
        password
      );

      if (previewResult) {
        toast({
          title: "Preview successful",
          description: "Certificate validated. Review the extracted keys and click Save to upload.",
        });
      }
    },
    [
      organizationId,
      certificateType,
      password,
      validateFileExtension,
      previewCertificate,
      clearPreview,
      clearError,
      toast,
    ]
  );

  /**
   * Handles file removal
   */
  const handleFileRemove = useCallback(() => {
    setFile(null);
    clearPreview();
    clearError();
  }, [clearPreview, clearError]);

  /**
   * Handles final certificate upload
   */
  const handleSave = useCallback(async () => {
    if (!previewData || !file) {
      toast({
        title: "No certificate to upload",
        description: "Please select a valid certificate file first.",
        variant: "destructive",
      });
      return;
    }

    // Step 2: Upload the certificate for final persistence
    const result = await uploadCertificate(
      organizationId,
      file,
      certificateType,
      password,
      previewData.certificate_id
    );

    if (result) {
      toast({
        title: "Certificate uploaded",
        description: "Your certificate has been successfully uploaded and saved.",
      });
      onUpload(result);

      // Reset state
      setFile(null);
      setPassword("");
      clearPreview();
      clearError();
      onClose();
    }
  }, [
    previewData,
    file,
    organizationId,
    certificateType,
    password,
    uploadCertificate,
    onUpload,
    onClose,
    clearPreview,
    clearError,
    toast,
  ]);

  // Transform preview data to VerificationMethod for preview
  const previewKeys: VerificationMethod[] = previewData
    ? [
        {
          id: previewData.certificate_id,
          type: "JsonWebKey2020",
          publicKeyJwk: previewData.public_jwk,
        },
      ]
    : [];

  // Computed states
  const hasError = !!previewError || !!uploadError;
  const isLoading = isPreviewing || isUploading;
  const canSave = !!previewData && !isLoading && !hasError;

  return {
    // State
    file,
    certificateType,
    password,

    // Computed state
    previewKeys,
    canSave,
    isLoading,
    hasError,

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
  };
}
