import { type OrgCreatePayload } from "../types/organization.types";

export const organizationMapper = {
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
