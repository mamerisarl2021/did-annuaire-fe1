import { httpClient } from "@/lib/shared/api/http.client";
import { API_ENDPOINTS } from "@/lib/shared/config/endpoints";
import {
  PublishRequest,
  PublishRequestListParams,
  PublishRequestStats,
  ApprovePayload,
  RejectPayload,
} from "../types/publish-request.types";
import { publishRequestMapper } from "../mappers/publish-request.mapper";

export const publishRequestService = {
  /**
   * Get publish requests list
   */
  async getPublishRequests(params: PublishRequestListParams): Promise<PublishRequest[]> {
    const query = new URLSearchParams();
    query.append("org_id", params.org_id);
    if (params.status) query.append("status", params.status);
    if (params.offset !== undefined) query.append("offset", params.offset.toString());
    if (params.limit !== undefined) query.append("limit", params.limit.toString());

    const endpoint = `${API_ENDPOINTS.PUBLISH_REQUESTS.LIST}?${query.toString()}`;
    const response = await httpClient.get<Array<Record<string, unknown>>>(endpoint, {
      requiresAuth: true,
    });

    return response.map(publishRequestMapper.toDomain);
  },

  /**
   * Get publish requests statistics
   */
  async getPublishRequestsStats(org_id: string): Promise<PublishRequestStats> {
    const query = new URLSearchParams({ org_id });
    const endpoint = `${API_ENDPOINTS.PUBLISH_REQUESTS.STATS}?${query.toString()}`;
    const response = await httpClient.get<Record<string, unknown>>(endpoint, {
      requiresAuth: true,
    });

    return publishRequestMapper.toStats(response);
  },

  /**
   * Approve a publish request
   */
  async approveRequest(id: string, payload: ApprovePayload = {}): Promise<unknown> {
    return await httpClient.post(API_ENDPOINTS.PUBLISH_REQUESTS.APPROVE(id), payload, {
      requiresAuth: true,
    });
  },

  /**
   * Reject a publish request
   */
  async rejectRequest(id: string, payload: RejectPayload = {}): Promise<unknown> {
    return await httpClient.post(API_ENDPOINTS.PUBLISH_REQUESTS.REJECT(id), payload, {
      requiresAuth: true,
    });
  },
};
