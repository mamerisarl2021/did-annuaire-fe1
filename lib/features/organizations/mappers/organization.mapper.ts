import {
  type OrgCreatePayload,
  type OrganizationListItem,
  type OrganizationStats,
} from "../types/organization.types";
import { type OrganizationStatusType } from "@/lib/types/organization-status";

export const organizationMapper = {
  toDomain(raw: any): OrganizationListItem {
    return {
      id: raw.id,
      name: raw.name || "N/A",
      type: raw.org_type || raw.type || "N/A",
      country: raw.country || "N/A",
      email: raw.email || "N/A",
      slug: raw.slug || "",
      status: raw.status as OrganizationStatusType,
      createdAt: raw.created_at,
      adminEmail: raw.admin?.email || raw.admin_email || "N/A",
      authorization_document: raw.documents?.authorization_document_url || raw.authorization_document,
      justification_document: raw.documents?.justification_document_url || raw.justification_document,
    };
  },

  toStats(raw: any): OrganizationStats {
    return {
      all: raw.all || 0,
      active: raw.active || 0,
      suspended: raw.suspended || 0,
    };
  },

  toFormData(payload: OrgCreatePayload): FormData {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("org_type", payload.org_type);
    formData.append("country", payload.country);
    formData.append("email", payload.email);
    formData.append("phone", payload.phone);
    formData.append("address", payload.address);

    if (payload.allowed_email_domains && payload.allowed_email_domains.length > 0) {
      payload.allowed_email_domains.forEach((domain) => {
        formData.append("allowed_email_domains", domain);
      });
    }

    formData.append("admin_email", payload.admin_email);
    formData.append("admin_first_name", payload.admin_first_name);
    formData.append("admin_last_name", payload.admin_last_name);
    formData.append("admin_phone", payload.admin_phone);
    formData.append("functions", payload.admin_functions);

    if (payload.authorization_document) {
      formData.append("authorization_document", payload.authorization_document);
    }

    if (payload.justification_document) {
      formData.append("justification_document", payload.justification_document);
    }

    return formData;
  },
};
