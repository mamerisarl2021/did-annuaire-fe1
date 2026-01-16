import {
  type OrgCreatePayload,
  type OrganizationListItem,
  type OrganizationStats,
} from "../types/organization.types";
import { type OrganizationStatusType } from "@/lib/types/organization-status";

export const organizationMapper = {
  toDomain(raw: Record<string, unknown>): OrganizationListItem {
    const admin = raw.admin as Record<string, unknown> | undefined;
    const documents = raw.documents as Record<string, unknown> | undefined;

    return {
      id: raw.id as string,
      name: (raw.name as string) || "N/A",
      type: (raw.org_type as string) || (raw.type as string) || "N/A",
      country: (raw.country as string) || "N/A",
      email: (raw.email as string) || "N/A",
      slug: (raw.slug as string) || "",
      status: raw.status as OrganizationStatusType,
      createdAt: raw.created_at as string,
      adminEmail: (admin?.email as string) || (raw.admin_email as string) || "N/A",
      authorization_document:
        (documents?.authorization_document_url as string) || (raw.authorization_document as string),
      justification_document:
        (documents?.justification_document_url as string) || (raw.justification_document as string),
    };
  },

  toStats(raw: Record<string, unknown>): OrganizationStats {
    return {
      all: (raw.all as number) || 0,
      active: (raw.active as number) || 0,
      suspended: (raw.suspended as number) || 0,
      pending: (raw.pending as number) || 0,
      refused: (raw.refused as number) || 0,
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
