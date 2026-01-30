import { multipartClient } from "@/lib/shared/api/multipart.client";
import { httpClient } from "@/lib/shared/api/http.client";
import { API_ENDPOINTS } from "@/lib/shared/config/endpoints";
import type {
  DIDStateEnvelope,
  UploadCertificateResponse,
  PreviewDIDParams,
  CreateDIDPayload,
  DIDMethod,
  DIDListParams,
  DIDListResponse,
  DIDResolutionResponse,
  KeysResponse,
  DEACTIVATEDIDResponse,
} from "../types/api.types";
import type { DIDStats } from "../types";

/**
 * DID Service
 * Centralized API client using shared infrastructure
 */
export const didService = {
  /**
   * Upload de certificat
   */
  async uploadCertificate(formData: FormData): Promise<UploadCertificateResponse> {
    const response = await multipartClient.upload<UploadCertificateResponse>(
      API_ENDPOINTS.DID.CERTIFICATES,
      formData,
      { requiresAuth: true }
    );
    return response;
  },

  /**
   * Prévisualisation du DID (GET avec paramètres directs)
   */
  async previewDID(params: PreviewDIDParams): Promise<DIDStateEnvelope> {
    const query = new URLSearchParams({
      organization_id: params.organization_id,
      document_type: params.document_type,
      certificate_id: params.certificate_id,
    });

    if (params.purposes && params.purposes.length > 0) {
      params.purposes.forEach((p) => query.append("purposes", p));
    }

    const endpoint = `${API_ENDPOINTS.DID.PREVIEW}?${query.toString()}`;
    return await httpClient.get<DIDStateEnvelope>(endpoint, { requiresAuth: true });
  },

  /**
   * Création du DID (POST simple)
   */
  async createDID(payload: CreateDIDPayload): Promise<DIDStateEnvelope> {
    return await httpClient.post<DIDStateEnvelope>(API_ENDPOINTS.DID.CREATE, payload, {
      requiresAuth: true,
    });
  },

  /**
   * Get all DIDs (GET)
   */
  async getAllDIDs(params: DIDListParams = {}): Promise<DIDListResponse> {
    const query = new URLSearchParams();
    if (params.org_id) query.append("org_id", params.org_id);
    if (params.page) query.append("page", params.page.toString());
    if (params.page_size) query.append("page_size", params.page_size.toString());

    const endpoint = `${API_ENDPOINTS.DID.LIST}?${query.toString()}`;

    return await httpClient.get<DIDListResponse>(endpoint, { requiresAuth: true });
  },

  /**
   * Récupère la liste des méthodes DID supportées
   */
  async getDIDMethods(): Promise<DIDMethod[]> {
    const response = await httpClient.get<{ items: DIDMethod[] }>(API_ENDPOINTS.DID.METHODS, {
      requiresAuth: false,
    });
    return response.items;
  },

  /**
   * Resolve a DID using the Universal Resolver API
   */
  async resolveDID(
    identifier: string,
    env: "prod" | "draft" = "prod"
  ): Promise<DIDResolutionResponse> {
    const query = new URLSearchParams({ environment: env });
    const encodedIdentifier = encodeURIComponent(identifier);
    const endpoint = `${API_ENDPOINTS.DID.RESOLVE(encodedIdentifier)}?${query.toString()}`;

    return await httpClient.get<DIDResolutionResponse>(endpoint, {
      requiresAuth: false,
      headers: {
        Accept: "application/did-resolution+json",
      },
    });
  },

  /**
   * Rotation de clé (reconstruction du DRAFT)
   */
  async rotateKey(
    did: string,
    payload: { certificate_id: string; purposes?: string[] }
  ): Promise<DIDStateEnvelope> {
    return await httpClient.post<DIDStateEnvelope>(API_ENDPOINTS.DID.ROTATE(did), payload, {
      requiresAuth: true,
    });
  },

  /**
   * Publication du DID en PROD
   */
  async publishDID(did: string, version?: number): Promise<DIDStateEnvelope> {
    return await httpClient.post<DIDStateEnvelope>(
      API_ENDPOINTS.DID.PUBLISH(did),
      { version },
      { requiresAuth: true }
    );
  },

  /**
   * Universal Registrar Update (DRAFT generation)
   */
  async updateDID(did: string): Promise<DIDStateEnvelope> {
    return await httpClient.post<DIDStateEnvelope>(
      API_ENDPOINTS.DID.UPDATE,
      { did },
      { requiresAuth: true }
    );
  },

  /**
   * Get DID Details
   */
  async getDID(
    didId: string,
    target: "draft" | "prod",
    version?: number
  ): Promise<DIDStateEnvelope> {
    const query = new URLSearchParams({ target });
    if (version) {
      query.append("version", version.toString());
    }
    const endpoint = `${API_ENDPOINTS.DID.DETAILS(didId)}?${query.toString()}`;
    return await httpClient.get<DIDStateEnvelope>(endpoint, {
      requiresAuth: true,
    });
  },

  /**
   * Fetch DID Keys
   */
  async fetchKeys(didId: string): Promise<KeysResponse> {
    return await httpClient.get<KeysResponse>(API_ENDPOINTS.DID.KEYS(didId), {
      requiresAuth: true,
    });
  },

  async deactivateDID(did: string): Promise<DEACTIVATEDIDResponse> {
    await httpClient.post(API_ENDPOINTS.DID.DEACTIVATE, { did }, { requiresAuth: true });
    return { "@context": ["https://www.w3.org/ns/did/v1"], did, deactivated: true };
  },

  /**
   * Get DIDs statistics
   */
  async getDIDsStats(): Promise<DIDStats> {
    const response = await httpClient.get<{ success: boolean; message: string; data: DIDStats }>(
      API_ENDPOINTS.DID.STATS,
      { requiresAuth: true }
    );
    return response.data;
  },
};
