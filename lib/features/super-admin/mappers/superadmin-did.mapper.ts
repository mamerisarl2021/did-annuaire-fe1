import { DID, DIDDocument } from "../../did/types";

export const superAdminDidMapper = {
  toDomain(apiData: Record<string, unknown>): DID {
    return {
      id: apiData.did as string,
      method: "WEB", // As seen in other mappers
      didDocument: {} as DIDDocument,
      created: apiData.created_at as string,
      organization_name: apiData.organization as string,
      document_type: apiData.document_type as string,
      version: apiData.latest_version as number,
      status: apiData.status as DID["status"],
      state: "action", // Default for list view consistency
      // Superadmin API has limited fields in list
      is_published: apiData.status === "ACTIVE",
    };
  },

  toDomainList(items: Record<string, unknown>[]): DID[] {
    return items.map((item) => this.toDomain(item));
  },

  toStats(apiData: Record<string, unknown>) {
    const byStatus = (apiData.by_status as Record<string, number>) || {};
    const byEnv = (apiData.by_environment as Record<string, number>) || {};

    return {
      total: (apiData.total as number) || 0,
      published: byStatus.active || 0,
      draft: byStatus.draft || 0,
      deactivated: byStatus.deactivated || 0,
      by_environment: {
        prod: byEnv.prod || 0,
        draft: byEnv.draft || 0,
      },
    };
  },
};
