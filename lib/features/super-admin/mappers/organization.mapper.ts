import { type OrganizationListItem, type OrganizationStatus } from "../types/organization.types";

export const organizationMapper = {
  toDomain(raw: any): OrganizationListItem {
    return {
      id: raw.id,
      name: raw.name,
      type: raw.type || raw.org_type,
      country: raw.country,
      email: raw.email,
      phone: raw.phone || "",
      status: raw.status as OrganizationStatus,
      createdAt: raw.created_at,
      adminEmail: raw.admin?.email || raw.admin_email || "N/A",
    };
  },

  toDomainList(rawList: any[]): OrganizationListItem[] {
    return rawList.map((item) => this.toDomain(item));
  },
};
