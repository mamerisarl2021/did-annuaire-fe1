import { httpClient } from "@/lib/shared/api/http.client";
import {
  type OrganizationListItem,
  type OrganizationListResponse,
  type OrganizationListParams,
  type OrganizationStats,
} from "../../organizations/types/organization.types";
import { organizationMapper } from "../mappers/organization.mapper";
import { logger } from "@/lib/shared/services/logger.service";

const SUPERADMIN_ENDPOINTS = {
  LIST: "/api/superadmin/organizations",
  STATS: "/api/superadmin/organizations/stats",
  DETAILS: (id: string) => `/api/superadmin/organizations/${id}`,
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

    const endpoint = `${SUPERADMIN_ENDPOINTS.LIST}?${searchParams.toString()}`;
    logger.debug("Fetching Organizations from:", { endpoint });
    const response = await httpClient.get<Record<string, unknown>>(endpoint);
    const rawData = (response.data as Record<string, unknown>) || response;
    const rawItems = (rawData.items as Record<string, unknown>[]) || (rawData.results as Record<string, unknown>[]) || [];
    const rawPagination = (rawData.pagination as Record<string, unknown>) || {};

    const mappedResults = organizationMapper.toDomainList(rawItems);

    return {
      data: {
        results: mappedResults,
        count: (rawPagination.count as number) || mappedResults.length,
        next: (rawPagination.next_url as string) || (rawData.next as string),
        previous: (rawPagination.prev_url as string) || (rawData.previous as string),
      },
    };
  },

  async getStats(): Promise<OrganizationStats> {
    try {
      const response = await httpClient.get<Record<string, unknown>>(SUPERADMIN_ENDPOINTS.STATS);
      return ((response.data as OrganizationStats) || response) as OrganizationStats;
    } catch (error) {
      logger.error("Failed to fetch organization stats", error, { endpoint: SUPERADMIN_ENDPOINTS.STATS });
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

  async getOrganizationDetails(id: string): Promise<OrganizationListItem> {
    const response = await httpClient.get<Record<string, unknown>>(SUPERADMIN_ENDPOINTS.DETAILS(id));
    const rawData = (response.data as Record<string, unknown>) || response;
    return organizationMapper.toDomain(rawData);
  },

  async deleteOrganization(id: string): Promise<void> {
    await httpClient.delete(`/api/superadmin/organizations/${id}/delete`);
  },
};
