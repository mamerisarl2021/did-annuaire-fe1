import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import type {
  DIDStateEnvelope,
  UploadCertificateResponse,
  PreviewDIDParams,
  CreateDIDPayload,
  DIDMethod,
  DIDListParams,
  DIDListResponse,
  DIDResolutionResponse,
} from "../types/api.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Helper pour les headers d'authentification
 */
const getAuthHeaders = (isJson = true): HeadersInit => {
  const headers: HeadersInit = {};
  const token = tokenStorage.getAccessToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

/**
 * Client API DID - Version ultra-simplifiée
 */
export const didApiClient = {
  /**
   * Upload de certificat
   */
  async uploadCertificate(formData: FormData): Promise<UploadCertificateResponse> {
    const res = await fetch(`${API_URL}/api/registry/certificates`, {
      method: "POST",
      headers: getAuthHeaders(false),
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = errorData.detail || errorData.message || "Upload failed";
      throw new Error(typeof detail === "object" ? JSON.stringify(detail, null, 2) : detail);
    }

    return await res.json();
  },

  /**
   * Prévisualisation du DID (GET avec paramètres directs)
   */
  async previewDID(params: PreviewDIDParams): Promise<DIDStateEnvelope> {
    const query = new URLSearchParams({
      organization_id: params.organization_id,
      document_type: params.document_type,
      certificate_id: params.certificate_id,
      key_id: params.key_id,
    });

    if (params.purposes && params.purposes.length > 0) {
      query.set("purposes", params.purposes.join(","));
    }

    const url = `${API_URL}/api/registry/dids/preview?${query.toString()}`;
    console.log("[DID API] Preview URL:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(false),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = errorData.detail || errorData.message || "Preview failed";
      throw new Error(typeof detail === "object" ? JSON.stringify(detail, null, 2) : detail);
    }

    return await res.json();
  },

  /**
   * Création du DID (POST simple)
   */
  async createDID(payload: CreateDIDPayload): Promise<DIDStateEnvelope> {
    const res = await fetch(`${API_URL}/api/registry/dids`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = errorData.detail || errorData.message || "Create failed";
      throw new Error(typeof detail === "object" ? JSON.stringify(detail, null, 2) : detail);
    }

    return await res.json();
  },

  /**
   * Get all DIDs (GET)
   */
  async getAllDIDs(params: DIDListParams = {}): Promise<DIDListResponse> {
    const query = new URLSearchParams();
    if (params.org_id) query.append("org_id", params.org_id);
    if (params.page) query.append("page", params.page.toString());
    if (params.page_size) query.append("page_size", params.page_size.toString());

    const url = `${API_URL}/api/registry/dids?${query.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(true),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = errorData.detail || errorData.message || "Failed to fetch DIDs";
      throw new Error(typeof detail === "object" ? JSON.stringify(detail, null, 2) : detail);
    }

    return await res.json();
  },

  /**
   * Récupère la liste des méthodes DID supportées
   */
  async getDIDMethods(): Promise<DIDMethod[]> {
    const res = await fetch(`${API_URL}/api/universal-registrar/methods`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = errorData.detail || errorData.message || "Failed to fetch DID methods";
      throw new Error(typeof detail === "object" ? JSON.stringify(detail, null, 2) : detail);
    }
    const response = await res.json();
    return response.items;
  },

  /**
   * Resolve a DID using the Universal Resolver API
   */
  async resolveDID(
    identifier: string,
    env: "prod" | "preprod" = "prod"
  ): Promise<DIDResolutionResponse> {
    const query = new URLSearchParams({ env });
    const encodedIdentifier = encodeURIComponent(identifier);
    const url = `${API_URL}/api/universal-resolver/identifiers/${encodedIdentifier}?${query.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/did-resolution+json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = errorData.detail || errorData.message || "DID Resolution failed";
      throw new Error(typeof detail === "object" ? JSON.stringify(detail, null, 2) : detail);
    }

    return await res.json();
  },
};
