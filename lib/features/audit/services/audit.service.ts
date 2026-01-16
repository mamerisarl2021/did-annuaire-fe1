import { httpClient } from "@/lib/shared/api/http.client";
import { API_ENDPOINTS } from "@/lib/shared/config/endpoints";
import {
    type AuditListParams,
    type AuditListResponse,
    type AuditStats,
    type AuditAction,
} from "../types/audit.types";

/**
 * Service to handle Audit API requests
 * Supports both Superuser (all logs) and Org Admin (organization-specific logs)
 */
export const auditService = {
    /**
     * Get audit actions with pagination and filters
     */
    async getAuditActions(params: AuditListParams = {}): Promise<AuditListResponse> {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.offset !== undefined) queryParams.append("offset", params.offset.toString());
        if (params.category && params.category !== "all") queryParams.append("category", params.category);
        if (params.severity && params.severity !== "all") queryParams.append("severity", params.severity);
        if (params.action) queryParams.append("action", params.action);
        if (params.user_id) queryParams.append("user_id", params.user_id);
        if (params.q) queryParams.append("q", params.q);
        if (params.date_from) queryParams.append("date_from", params.date_from);
        if (params.date_to) queryParams.append("date_to", params.date_to);
        if (params.organization_id) queryParams.append("organization_id", params.organization_id);

        const endpoint = `${API_ENDPOINTS.AUDIT.ACTIONS}?${queryParams.toString()}`;

        const response = await httpClient.get<Record<string, unknown>>(endpoint, {
            requiresAuth: true,
        });

        return {
            items: (response.items as AuditAction[]) || [],
            count: (response.count as number) || 0,
        };
    },

    /**
     * Get details for a specific audit action
     */
    async getAuditActionDetails(id: string): Promise<AuditAction> {
        const endpoint = `${API_ENDPOINTS.AUDIT.ACTIONS}/${id}`;
        return httpClient.get<AuditAction>(endpoint, {
            requiresAuth: true,
        });
    },

    /**
     * Get audit statistics by category
     */
    async getAuditStats(params: { organization_id?: string } = {}): Promise<{ items: AuditStats[] }> {
        const queryParams = new URLSearchParams();
        if (params.organization_id) queryParams.append("organization_id", params.organization_id);

        const endpoint = `${API_ENDPOINTS.AUDIT.STATS_CATEGORY}?${queryParams.toString()}`;
        const response = await httpClient.get<Record<string, unknown>>(endpoint, {
            requiresAuth: true,
        });

        return {
            items: (response.items as AuditStats[]) || [],
        };
    },
};
