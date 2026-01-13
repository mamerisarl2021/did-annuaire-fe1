import { type OrganizationListItem, type OrganizationStatus } from "../types/organization.types";

export const organizationMapper = {
  toDomain(raw: any): OrganizationListItem {
    return {
      id: raw.id,
      name: raw.name,
      type: raw.type || raw.org_type,
      country: raw.country,
      email: raw.email,
      slug: raw.slug || "",
      status: raw.status as OrganizationStatus,
      createdAt: raw.created_at,
      adminEmail: raw.admin?.email || raw.admin_email || "N/A",
      authorization_document: raw.documents?.authorization_document_url || raw.authorization_document,
      justification_document: raw.documents?.justification_document_url || raw.justification_document,
    };
  },

  toDomainList(rawList: any[]): OrganizationListItem[] {
    return rawList.map((item) => this.toDomain(item));
  },
};
