import { httpClient } from "@/lib/shared/api/http.client";
import {
  type OrganizationListItem,
  type OrganizationListResponse,
  type OrganizationListParams,
  type OrganizationStats,
} from "../../organizations/types/organization.types";
import { organizationMapper } from "../mappers/organization.mapper";
import { superAdminPublishRequestMapper } from "../mappers/superadmin-publish-request.mapper";
import { superAdminDidMapper } from "../mappers/superadmin-did.mapper";
import { superAdminUserMapper } from "../mappers/superadmin-user.mapper";
import { logger } from "@/lib/shared/services/logger.service";
import { API_ENDPOINTS } from "@/lib/shared/config/endpoints";
import { PublishRequest } from "../../publish-requests/types/publish-request.types";
import { DID } from "../../did/types";
import { User } from "../../users/types/users.types";

export const superAdminService = {
  async getPublishRequests(params: { page: number; page_size: number; status?: string; search?: string }): Promise<{ items: PublishRequest[] }> {
    const searchParams = new URLSearchParams();
    searchParams.append("page", params.page.toString());
    searchParams.append("page_size", params.page_size.toString());
    if (params.status && params.status !== "all") searchParams.append("status", params.status);
    if (params.search) searchParams.append("search", params.search);

    const endpoint = `${API_ENDPOINTS.SUPERADMIN.PUBLISH_REQUESTS_LIST}?${searchParams.toString()}`;
    const response = await httpClient.get<any>(endpoint);
    const rawData = response.data || response;
    const items = superAdminPublishRequestMapper.toDomainList(rawData.items || rawData.results || []);

    return { items };
  },

  async getDIDs(params: { page: number; page_size: number; status?: string; search?: string }): Promise<{ items: DID[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    searchParams.append("page", params.page.toString());
    searchParams.append("page_size", params.page_size.toString());
    if (params.status && params.status !== "all") searchParams.append("status", params.status);
    if (params.search) searchParams.append("search", params.search);

    const endpoint = `${API_ENDPOINTS.SUPERADMIN.DIDS_LIST}?${searchParams.toString()}`;
    const response = await httpClient.get<any>(endpoint);
    const rawData = response.data || response;
    const items = superAdminDidMapper.toDomainList(rawData.items || rawData.results || []);
    const pagination = rawData.pagination || {
      page: params.page,
      page_size: params.page_size,
      count: items.length,
      total_pages: 1,
    };

    return { items, pagination };
  },

  async getUsers(params: { page: number; page_size: number; status?: string; search?: string }): Promise<{ data: { items: User[]; pagination: any } }> {
    const searchParams = new URLSearchParams();
    searchParams.append("page", params.page.toString());
    searchParams.append("page_size", params.page_size.toString());
    if (params.status && params.status !== "all") searchParams.append("status", params.status);
    if (params.search) searchParams.append("search", params.search);

    const endpoint = `${API_ENDPOINTS.SUPERADMIN.USERS_LIST}?${searchParams.toString()}`;
    const response = await httpClient.get<any>(endpoint);
    const rawData = response.data || response;
    const items = superAdminUserMapper.toDomainList(rawData.items || rawData.results || []);
    const pagination = rawData.pagination || {
      page: params.page,
      page_size: params.page_size,
      count: items.length,
      total_pages: 1,
      has_next: false,
      has_previous: false,
    };

    return { data: { items, pagination } };
  },

  async getDIDsStats(): Promise<any> {
    const response = await httpClient.get<any>(API_ENDPOINTS.SUPERADMIN.DIDS_STATS);
    const rawData = response.data || response;
    // According to readme, stats are nested in "data"
    const statsData = rawData.data || rawData;
    return superAdminDidMapper.toStats(statsData);
  },

  async getOrganizations(
    params: OrganizationListParams = {}
  ): Promise<{ data: OrganizationListResponse }> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.page_size) searchParams.append("page_size", params.page_size.toString());
    if (params.status) searchParams.append("status", params.status);
    if (params.search) searchParams.append("search", params.search);

    const endpoint = `${API_ENDPOINTS.SUPERADMIN.LIST}?${searchParams.toString()}`;
    logger.debug("Fetching Organizations from:", { endpoint });
    const response = await httpClient.get<Record<string, unknown>>(endpoint);
    const rawData = (response.data as Record<string, unknown>) || response;
    const rawItems =
      (rawData.items as Record<string, unknown>[]) ||
      (rawData.results as Record<string, unknown>[]) ||
      [];
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
      const response = await httpClient.get<Record<string, unknown>>(
        API_ENDPOINTS.SUPERADMIN.STATS
      );
      return ((response.data as OrganizationStats) || response) as OrganizationStats;
    } catch (error) {
      logger.error("Failed to fetch organization stats", error, {
        endpoint: API_ENDPOINTS.SUPERADMIN.STATS,
      });
      return { pending: 0, active: 0, suspended: 0, refused: 0, all: 0 };
    }
  },

  async validateOrganization(id: string): Promise<void> {
    await httpClient.post(API_ENDPOINTS.SUPERADMIN.VALIDATE(id));
  },

  async refuseOrganization(id: string, reason: string): Promise<void> {
    await httpClient.post(API_ENDPOINTS.SUPERADMIN.REFUSE(id), { reason });
  },

  async toggleOrganizationStatus(id: string): Promise<void> {
    await httpClient.patch(API_ENDPOINTS.SUPERADMIN.TOGGLE_ACTIVATION(id));
  },

  async getOrganizationDetails(id: string): Promise<OrganizationListItem> {
    const response = await httpClient.get<Record<string, unknown>>(
      API_ENDPOINTS.SUPERADMIN.DETAILS(id)
    );
    const rawData = (response.data as Record<string, unknown>) || response;
    return organizationMapper.toDomain(rawData);
  },

  async deleteOrganization(id: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.SUPERADMIN.DELETE(id));
  },
};
