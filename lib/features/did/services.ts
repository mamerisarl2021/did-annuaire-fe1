import { DID, CreateDIDRequest, CreateDIDResponse, VerificationMethod, DIDDocument } from "./types";
import { didApiClient } from "./api/didApiClient";
import { DIDListParams, DIDListPagination } from "./types/api.types";

// Mock data
const mockDIDs: DID[] = [
  {
    id: "did:web:example.com",
    method: "WEB",
    created: new Date().toISOString(),
    didDocument: {
      "@context": ["https://www.w3.org/ns/did/v1"],
      id: "did:web:example.com",
      verificationMethod: [],
      authentication: [],
      assertionMethod: [],
      keyAgreement: [],
      service: [],
    },
  },
];

export const didService = {
  async getDIDs(
    params: DIDListParams = {}
  ): Promise<{ items: DID[]; pagination: DIDListPagination }> {
    try {
      const response = await didApiClient.getAllDIDs(params);
      const items = response.items.map((item) => ({
        id: item.did,
        method: "WEB" as const,
        didDocument: {} as DIDDocument,
        created: item.created_at || new Date().toISOString(),
        organization_id: item.organization_id,
        organization_name: item.organization_name,
        owner_id: item.owner_id,
        document_type: item.document_type,
        key_id: item.key_id,
        public_key_version: item.public_key_version,
        public_key_jwk: item.public_key_jwk,
        metadata: {
          version: item.latest_version,
          document_type: item.document_type,
        },
      }));
      return { items, pagination: response.pagination };
    } catch (error) {
      console.error("Error fetching DIDs:", error);
      return {
        items: [],
        pagination: { page: 1, page_size: 10, total: 0, total_pages: 0 },
      };
    }
  },

  async getDIDById(id: string): Promise<DID | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockDIDs.find((did) => did.id === id);
  },

  async createDID(request: CreateDIDRequest): Promise<CreateDIDResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      did: `did:${request.method.toLowerCase()}:${Math.random().toString(36).substring(2, 15)}`,
      didDocument: request.didDocument,
      metadata: {
        created: new Date().toISOString(),
      },
    };
  },

  async updateDID(request: {
    id: string;
    didDocument: DIDDocument;
    options: Record<string, unknown>;
  }): Promise<{
    did: string;
    didDocument: DIDDocument;
    metadata: { updated: string; [key: string]: unknown };
  }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      did: request.id,
      didDocument: request.didDocument,
      metadata: {
        updated: new Date().toISOString(),
      },
    };
  },

  async fetchDIDKeys(didId: string): Promise<VerificationMethod[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock response
    return [
      {
        id: "#key-1",
        type: "JsonWebKey2020",
        controller: didId,
        publicKeyJwk: {
          kty: "OKP",
          crv: "Ed25519",
          x: "VCpo2L_qn_1-Gv9GkS2X-V_K8_fG_V_K8_fG_V_K8_fG",
        },
      },
      {
        id: "#key-2",
        type: "JsonWebKey2020",
        controller: didId,
        publicKeyJwk: {
          kty: "OKP",
          crv: "X25519",
          x: "H_W_O_H_W_O_H_W_O_H_W_O_H_W_O_H_W_O_H_W_O",
        },
      },
    ];
  },
};
