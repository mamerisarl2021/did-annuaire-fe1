import { multipartClient } from "@/lib/shared/api/multipart.client";
import { httpClient } from "@/lib/shared/api/http.client";
import { API_ENDPOINTS } from "@/lib/shared/config/endpoints";
import {
  type OrgCreatePayload,
  type OrganizationListItem,
  type OrganizationListResponse,
  type OrganizationStats,
  type OrganizationListParams,
} from "../types/organization.types";
import { organizationMapper } from "../mappers/organization.mapper";

export const organizationService = {
  /**
   * Create a new organization with documents
   */
  async createOrganization(payload: OrgCreatePayload): Promise<OrganizationListItem> {
    const formData = organizationMapper.toFormData(payload);

    const response = await multipartClient.upload<Record<string, unknown>>(
      API_ENDPOINTS.ORGANIZATIONS.CREATE,
      formData,
      { requiresAuth: false }
    );
    return organizationMapper.toDomain(response);
  },

  /**
   * Get organization details
   */
  async getOrganizationDetails(id: string): Promise<OrganizationListItem> {
    const response = await httpClient.get<Record<string, unknown>>(
      API_ENDPOINTS.ORGANIZATIONS.DETAILS(id),
      {
        requiresAuth: true,
      }
    );
    return organizationMapper.toDomain(response);
  },

  /**
   * Get organizations list with pagination and filters
   */
  async getOrganizationsList(
    params: OrganizationListParams = {}
  ): Promise<OrganizationListResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.page_size) queryParams.append("page_size", params.page_size.toString());
    if (params.status && params.status !== "all") queryParams.append("status", params.status);
    if (params.search) queryParams.append("search", params.search);

    const endpoint = `${API_ENDPOINTS.ORGANIZATIONS.LIST}?${queryParams.toString()}`;

    const response = await httpClient.get<Record<string, unknown>>(endpoint, {
      requiresAuth: true,
    });

    return {
      results: ((response.results as Array<Record<string, unknown>>) || []).map(
        organizationMapper.toDomain
      ),
      count: (response.count as number) || 0,
      next: response.next as string | null,
      previous: response.previous as string | null,
      stats: response.stats
        ? organizationMapper.toStats(response.stats as Record<string, unknown>)
        : undefined,
    };
  },

  /**
   * Get organizations stats
   */
  async getOrganizationsStats(): Promise<OrganizationStats> {
    const response = await httpClient.get<Record<string, unknown>>(
      API_ENDPOINTS.ORGANIZATIONS.STATS,
      {
        requiresAuth: true,
      }
    );
    return organizationMapper.toStats(response);
  },
};
