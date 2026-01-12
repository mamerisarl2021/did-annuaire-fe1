import { type OrganizationStatusType } from "@/lib/types/organization-status";

export interface OrgCreatePayload {
  name: string;
  org_type: string;
  country: string;
  email: string;
  phone: string;
  address: string;
  allowed_email_domains: string[];

  admin_email: string;
  admin_first_name: string;
  admin_last_name: string;
  admin_phone: string;
  admin_functions: string;

  authorization_document: File;
  justification_document?: File;
}

export interface OrgCreateResponse {
  id: string;
  name: string;
  status: OrganizationStatusType;
  created_at: string;
}
