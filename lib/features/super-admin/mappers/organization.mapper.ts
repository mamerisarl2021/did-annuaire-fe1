import {
  type OrganizationListItem,
  type OrganizationStatus,
} from "../../organizations/types/organization.types";

export const organizationMapper = {
  toDomain(raw: Record<string, unknown>): OrganizationListItem {
    const admin = raw.admin as Record<string, unknown> | undefined;
    const documents = raw.documents as Record<string, unknown> | undefined;

    return {
      id: raw.id as string,
      name: raw.name as string,
      type: (raw.type as string) || (raw.org_type as string),
      country: raw.country as string,
      email: raw.email as string,
      slug: (raw.slug as string) || "",
      status: raw.status as OrganizationStatus,
      createdAt: raw.created_at as string,
      adminEmail: (admin?.email as string) || (raw.admin_email as string) || "N/A",
      authorization_document:
        (documents?.authorization_document_url as string) || (raw.authorization_document as string),
      justification_document:
        (documents?.justification_document_url as string) || (raw.justification_document as string),
    };
  },

  toDomainList(rawList: Record<string, unknown>[]): OrganizationListItem[] {
    return rawList.map((item) => this.toDomain(item));
  },
};
