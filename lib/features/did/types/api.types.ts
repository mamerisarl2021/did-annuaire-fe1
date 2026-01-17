import { DIDDocument } from "../types";

/**
 * Backend API Response Envelope
 * All DID operations return this structure
 */
export interface DIDStateEnvelope {
  didState: {
    state: "action" | "wait" | "error" | "finished" | "update";
    did?: string;
    didDocument?: DIDDocument;
    reason?: string;
    environment?: "DRAFT" | "PREPROD" | "PROD";
  };
  didDocumentMetadata?: {
    versionId?: number;
    published?: boolean;
    [key: string]: unknown;
  };
  didRegistrationMetadata: {
    method: "web";
    requestId: string;
    [key: string]: unknown;
  };
}

/**
 * Certificate Upload
 */
export interface UploadCertificateRequest {
  organization_id: string;
  format: "PEM" | "DER" | "PKCS7" | "PKCS12";
  file: File;
  password?: string;
}

export interface UploadCertificateResponse {
  id: string;
  certificate_id?: string;
  extracted_jwk: {
    kty: string;
    crv?: string;
    x?: string;
    y?: string;
    n?: string;
    e?: string;
    [key: string]: unknown;
  };
}

/**
 * Payload pour la prévisualisation (Preview)
 */
export interface PreviewDIDParams {
  organization_id: string;
  document_type: string;
  certificate_id: string;
  key_id: string;
  purposes?: string[];
}

/**
 * Payload pour la création (Create)
 */
export interface CreateDIDPayload {
  organization_id: string;
  document_type: string;
  certificate_id: string;
  key_id: string;
  purposes: string[];
  owner_id: string;
  services?: string[];
  keys?: string[];
}

/**
 * API Error Response
 */
export interface APIErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}
