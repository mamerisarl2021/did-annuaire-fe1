import { DID, DIDDocument } from "../../did/types";

export const superAdminDidMapper = {
  toDomain(apiData: Record<string, any>): DID {
    return {
      id: apiData.did,
      method: "WEB", // As seen in other mappers
      didDocument: {} as DIDDocument,
      created: apiData.created_at,
      organization_name: apiData.organization,
      document_type: apiData.document_type,
      version: apiData.latest_version,
      status: apiData.status,
      // Superadmin API has limited fields in list
      is_published: apiData.status === "ACTIVE",
    };
  },

  toDomainList(items: any[]): DID[] {
    return items.map((item) => this.toDomain(item));
  },

  toStats(apiData: Record<string, any>) {
    return {
      total: apiData.total,
      published: apiData.by_status?.active || 0,
      draft: apiData.by_status?.draft || 0,
      deactivated: apiData.by_status?.deactivated || 0,
      by_environment: {
        prod: apiData.by_environment?.prod || 0,
        draft: apiData.by_environment?.draft || 0,
      },
    };
  },
};
