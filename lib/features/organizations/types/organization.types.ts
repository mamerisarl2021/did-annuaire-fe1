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

export interface OrganizationListItem {
  id: string;
  name: string;
  type: string;
  country: string;
  email: string;
  slug: string;
  status: OrganizationStatusType;
  createdAt: string;
  adminEmail?: string;
  authorization_document?: string;
  justification_document?: string;
}

export interface OrganizationStats {
  all: number;
  active: number;
  suspended: number;
}

export interface OrganizationListResponse {
  results: OrganizationListItem[];
  count: number;
  next: string | null;
  previous: string | null;
  stats?: OrganizationStats;
}

export interface OrganizationListParams {
  page?: number;
  page_size?: number;
  status?: OrganizationStatusType | "all";
  search?: string;
}
