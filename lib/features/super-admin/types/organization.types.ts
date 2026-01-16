export type OrganizationStatus = "ACTIVE" | "PENDING" | "REFUSED" | "SUSPENDED";

export interface OrganizationListItem {
  id: string;
  name: string;
  type: string;
  country: string;
  email: string;
  slug: string;
  status: OrganizationStatus;
  createdAt: string;
  adminEmail: string;
  authorization_document?: string;
  justification_document?: string;
}

export interface OrganizationStats {
  all: number;
  pending: number;
  active: number;
  suspended: number;
  refused?: number;
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
  status?: OrganizationStatus;
  search?: string;
}
