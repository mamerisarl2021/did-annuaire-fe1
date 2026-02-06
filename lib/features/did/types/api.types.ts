import { DIDDocument, JWK } from "../types";
import { CertificateType } from "./certificate.types";

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
    environment?: "DRAFT" | "PROD";
    organization_id?: string;
    owner_id?: string;
  };
  didDocumentMetadata?: {
    version?: number;
    published?: boolean;
    environment?: string;
    document_type?: string;
    key?: {
      key_id?: string;
      public_key_version: number;
      public_key_jwk: JWK;
      purposes: string[];
      certificate: {
        id: string;
        filename: string;
        url: string;
      };
    };
    status?: "ACTIVE" | "DRAFT" | "DEACTIVATED";
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
  format: CertificateType;
  file: File;
  password?: string;
}

/** Certificate Preview
 *
 */
export interface PreviewCertificateRequest {
  organization_id: string;
  format: CertificateType;
  file: File;
  password?: string;
}

export interface PreviewCertificateResponse {
  didState: {
    state: "action" | "wait" | "error" | "finished" | "update";
  };
  didRegistrationMetadata: {
    method: "web";
    requestId: string;
  };
  didDocumentMetadata: {
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
  };
}

export interface UploadCertificateResponse {
  didState: {
    state: "action" | "wait" | "error" | "finished" | "update";
  };
  didRegistrationMetadata: {
    method: "web";
    requestId: string;
  };
  didDocumentMetadata: {
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
  };
}
/**
 * Payload pour la prévisualisation (Preview)
 */
export interface PreviewDIDParams {
  organization_id: string;
  document_type: string;
  certificate_id: string;
  purposes?: string[];
}

/**
 * Payload pour la création (Create)
 */
export interface CreateDIDPayload {
  organization_id: string;
  document_type: string;
  certificate_id: string;
  purposes: string[];
  owner_id: string;
  services: string[];
  keys: string[];
}

/**
 * API Error Response
 */
export interface APIErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Supported DID Method (e.g., "web")
 */
export type DIDMethod = string;

export interface DIDListItem {
  did: string;
  organization_id: string;
  owner_id: string;
  document_type: string;
  latest_version: number;
  created_at?: string;
  organization_name?: string;
  key_id?: string;
  public_key_version?: number;
  public_key_jwk?: Record<string, unknown>;
  is_published?: boolean;
  status?: "ACTIVE" | "DRAFT" | "DEACTIVATED";
  state?: "action" | "wait" | "error" | "finished" | "update";

}

export interface DIDListPagination {
  page: number;
  page_size: number;
  total?: number;
  count?: number;
  total_pages: number;
}

export interface DIDListResponse {
  items: DIDListItem[];
  pagination: DIDListPagination;
}

export interface DIDListParams {
  org_id?: string;
  page?: number;
  page_size?: number;
}

export interface ResolutionParser {
  did: string;
  method: string;
  method_id: string;
  query: string;
}

export interface ResolutionService {
  id: string;
  type: string;
  service_endpoint: string | Record<string, unknown> | (string | Record<string, unknown>)[];
}

export interface ResolutionVerificationMethod {
  id: string;
  type: string;
  public_key_jwk: Record<string, unknown>;
}

export interface ResolutionResponseData {
  parser: ResolutionParser;
  services: ResolutionService[];
  verification_methods: ResolutionVerificationMethod[];
}

export interface DIDResolutionResponse {
  didDocument: DIDDocument;
  didDocumentMetadata: {
    contentType: string;
    [key: string]: unknown;
  };
  didResolutionMetadata: {
    contentType: string;
    driverUrl?: string;
    duration?: number;
    error?: string;
    did?: {
      didString: string;
      method: string;
    };
    [key: string]: unknown;
  };
  resolution_response?: ResolutionResponseData;
}

export interface DIDMethode {
  method: string;
  pattern: string;
  description: string;
}

export interface DIDMethodsResponse {
  items: DIDMethod[];
}

export interface PublicJwk {
  x: string;
  y: string;
  crv: string;
  kty: string;
}

export interface KeyObject {
  public_jwk: PublicJwk;
  key_id: string;
  versions: number[];
  current: number;
}

export type KeysResponse = KeyObject[];

export interface DEACTIVATEDIDResponse {
  "@context": ["https://www.w3.org/ns/did/v1"];
  did: string;
  deactivated: boolean;
}
