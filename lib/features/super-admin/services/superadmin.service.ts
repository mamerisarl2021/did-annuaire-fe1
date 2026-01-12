import { httpClient } from "@/lib/shared/api/http.client";
import {
  type OrganizationListResponse,
  type OrganizationListParams,
  type OrganizationStats,
} from "../types/organization.types";
import { organizationMapper } from "../mappers/organization.mapper";

const SUPERADMIN_Endpoints = {
  LIST: "/api/superadmin/organizations",
  STATS: "/api/superadmin/organizations/stats",
};

export const superAdminService = {
  async getOrganizations(
    params: OrganizationListParams = {}
  ): Promise<{ data: OrganizationListResponse }> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.page_size) searchParams.append("page_size", params.page_size.toString());
    if (params.status) searchParams.append("status", params.status);
    if (params.search) searchParams.append("search", params.search);

    const endpoint = `${SUPERADMIN_Endpoints.LIST}?${searchParams.toString()}`;
    console.log("Fetching Organizations from:", endpoint);
    const response = await httpClient.get<any>(endpoint);
    const rawData = response.data || response;
    const rawItems = rawData.items || rawData.results || [];
    const rawPagination = rawData.pagination || {};

    const mappedResults = organizationMapper.toDomainList(rawItems);

    return {
      data: {
        results: mappedResults,
        count: rawPagination.count || mappedResults.length,
        next: rawPagination.next_url || rawData.next,
        previous: rawPagination.prev_url || rawData.previous,
      },
    };
  },

  async getStats(): Promise<OrganizationStats> {
    try {
      const response = await httpClient.get<any>(SUPERADMIN_Endpoints.STATS);
      return response.data || response;
    } catch (error) {
      console.error("Failed to fetch stats", error);
      return { pending: 0, active: 0, suspended: 0, refused: 0, all: 0 };
    }
  },

  async validateOrganization(id: string): Promise<void> {
    await httpClient.post(`/api/superadmin/organizations/${id}/validate`);
  },

  async refuseOrganization(id: string, reason: string): Promise<void> {
    await httpClient.post(`/api/superadmin/organizations/${id}/refuse`, { reason });
  },

  async toggleOrganizationStatus(id: string): Promise<void> {
    await httpClient.patch(`/api/superadmin/organizations/${id}/toggle-activation`);
  },

  async deleteOrganization(id: string): Promise<void> {
    await httpClient.delete(`/api/superadmin/organizations/${id}/delete`);
  },
};
