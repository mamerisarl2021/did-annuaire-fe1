export type MethodType = "WEB";

export type ServiceType = "DIDCommMessaging" | "DecentralizedWebNode" | "LinkedDomains";

export type OptionKey =
  | "authentication"
  | "assertionMethod"
  | "keyAgreement"
  | "capabilityInvocation"
  | "capabilityDelegation";

export interface JWK {
  kty: string;
  crv?: string;
  x?: string;
  y?: string;
  n?: string;
  e?: string;
  [key: string]: unknown;
}

export interface Service {
  id: string;
  type: ServiceType;
  serviceEndpoint: string;
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller?: string;
  publicKeyJwk: JWK;
}

export interface DIDDocument {
  "@context": string[];
  id?: string;
  verificationMethod: VerificationMethod[];
  authentication: (string | VerificationMethod)[];
  assertionMethod: (string | VerificationMethod)[];
  keyAgreement: (string | VerificationMethod)[];
  service: Service[];
}

export interface DID {
  id: string;
  method: MethodType;
  didDocument: DIDDocument;
  created: string;
  updated?: string;
  organization_id?: string;
  organization_name?: string;
  owner_id?: string;
  document_type?: string;
  public_key_version?: number;
  public_key_jwk?: JWK;
  metadata?: {
    [key: string]: unknown;
  };
  is_published?: boolean;
  version?: number;
  status?: "ACTIVE" | "DRAFT" | "DEACTIVATED";
  state?: "action" | "wait" | "error" | "finished" | "update";
}

export type TabType = "request" | "response" | "error";

export type DIDMode = "create" | "update" | "resolve";

export interface CreateDIDOptions {
  authentication?: string[];
  assertionMethod?: string[];
  keyAgreement?: string[];
  capabilityInvocation?: string[];
  capabilityDelegation?: string[];
  [key: string]: unknown;
}

export interface CreateDIDRequest {
  method: MethodType;
  didDocument: DIDDocument;
  options: CreateDIDOptions;
  secret: unknown;
}

export interface CreateDIDResponse {
  did: string;
  didDocument: DIDDocument;
  metadata: {
    created: string;
    [key: string]: unknown;
  };
}

export interface DIDStats {
  total: number;
  published: number;
  draft: number;
  deactivated: number;
  by_environment: {
    prod: number;
    draft: number;
  };
}
