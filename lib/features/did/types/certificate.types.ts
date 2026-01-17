import { OptionKey } from "../types";

export type CertificateFormat = "PEM" | "DER" | "PKCS7" | "PKCS12" | "JWK";

/**
 * Represents a certificate key with its metadata
 */
export interface CertificateKey {
  certificate_id: string;
  key_id: string;
  extracted_jwk: {
    kty: string;
    crv?: string;
    x?: string;
    y?: string;
    n?: string;
    e?: string;
    [key: string]: unknown;
  };
  purposes: OptionKey[];
}

/**
 * Certificate upload state
 */
export interface CertificateUploadState {
  isUploading: boolean;
  uploadError: string | null;
  uploadedKeys: CertificateKey[];
}
