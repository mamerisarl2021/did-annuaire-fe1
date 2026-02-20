import {
  PublishRequest,
  PublishRequestStatus,
} from "../../publish-requests/types/publish-request.types";

export const superAdminPublishRequestMapper = {
  toDomain(apiData: Record<string, unknown>): PublishRequest {
    return {
      id: apiData.id as string,
      did: apiData.did as string,
      version: apiData.version as number,
      status: apiData.status as PublishRequestStatus,
      requested_by: apiData.requested_by as string,
      decided_by: (apiData.decided_by as string) || null,
      decided_at: (apiData.decided_at as string) || null,
      note: (apiData.note as string) || null,
      environment: (apiData.did as string)?.includes("draft") ? "DRAFT" : "PROD", // Heuristic if not provided
      organization_name: apiData.organization_name as string,
      created_at: (apiData.created_at as string) || new Date().toISOString(),
    };
  },

  toDomainList(items: Record<string, unknown>[]): PublishRequest[] {
    return items.map((item) => this.toDomain(item));
  },
};
