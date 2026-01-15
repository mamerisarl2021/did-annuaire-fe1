export type MethodType = "WEB";

export type ServiceType = "DIDCommMessaging" | "DecentralizedWebNode" | "LinkedDomains";

export interface Service {
  id: string;
  type: ServiceType;
  serviceEndpoint: string;
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller?: string;
  publicKeyJwk: {
    kty: string;
    crv?: string;
    x?: string;
    [key: string]: unknown;
  };
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
  metadata?: {
    [key: string]: unknown;
  };
}

export type TabType = "request" | "response" | "error";

export type OperationType = "CREATE" | "UPDATE" | "DEACTIVATE";
export interface CreateDIDOptions {
  clientSecretMode?: boolean;
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
