import {
  PublishRequest,
  PublishRequestStatus,
} from "../../publish-requests/types/publish-request.types";

export const superAdminPublishRequestMapper = {
  toDomain(apiData: Record<string, any>): PublishRequest {
    return {
      id: apiData.id,
      did: apiData.did,
      version: apiData.version,
      status: apiData.status as PublishRequestStatus,
      requested_by: apiData.requested_by,
      decided_by: apiData.decided_by,
      decided_at: apiData.decided_at,
      note: apiData.note,
      environment: (apiData.did as string)?.includes("draft") ? "DRAFT" : "PROD", // Heuristic if not provided
      organization_name: apiData.organization_name,
    };
  },

  toDomainList(items: any[]): PublishRequest[] {
    return items.map((item) => this.toDomain(item));
  },
};
