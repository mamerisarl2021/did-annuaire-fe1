import { DID, CreateDIDRequest, CreateDIDResponse, VerificationMethod } from "./types";

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
  async getDIDs(): Promise<DID[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockDIDs;
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

  async updateDID(request: { id: string; didDocument: any; options: any }): Promise<any> {
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
