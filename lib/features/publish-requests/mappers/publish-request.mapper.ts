import {
  PublishRequest,
  PublishRequestStats,
  PublishRequestStatus,
} from "../types/publish-request.types";

export const publishRequestMapper = {
  toDomain(apiData: Record<string, unknown>): PublishRequest {
    return {
      id: apiData.id as string,
      did: apiData.did as string,
      version: apiData.version as number,
      environment: apiData.environment as string,
      status: apiData.status as PublishRequestStatus,
      requested_by: apiData.requested_by as string,
      decided_by: (apiData.decided_by as string) || null,
      decided_at: (apiData.decided_at as string) || null,
      note: (apiData.note as string) || null,
      organization_name: apiData.organization_name as string,
      created_at: (apiData.created_at as string) || new Date().toISOString(),
    };
  },

  toStats(apiData: Record<string, unknown>): PublishRequestStats {
    return {
      total: apiData.total as number,
      pending: apiData.pending as number,
      approved: apiData.approved as number,
      rejected: apiData.rejected as number,
    };
  },
};
