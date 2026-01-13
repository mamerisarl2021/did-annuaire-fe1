import { httpClient } from "@/lib/shared/api/http.client";
import {
    Application,
    ApplicationListParams,
    ApplicationListResponse,
    CreateApplicationData,
} from "../types/application.types";

const APP_ENDPOINTS = {
    LIST: "/api/applications",
    CREATE: "/api/applications",
    // DELETE: (id: string) => `/api/applications/${id}`, // Dynamic construction
};

export const applicationService = {
    async getApplications(
        params: ApplicationListParams = {}
    ): Promise<{ data: ApplicationListResponse }> {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.page_size) searchParams.append("page_size", params.page_size.toString());
        if (params.search) searchParams.append("search", params.search);

        const endpoint = `${APP_ENDPOINTS.LIST}/?${searchParams.toString()}`;
        const response = await httpClient.get<any>(endpoint);
        const rawData = response.data || response;

        return {
            data: {
                results: rawData.results || rawData || [],
                count: rawData.count || (rawData.results ? rawData.results.length : 0),
                next: rawData.next,
                previous: rawData.previous,
            },
        };
    },

    async createApplication(data: CreateApplicationData): Promise<Application> {
        const response = await httpClient.post<any>(APP_ENDPOINTS.CREATE, data);
        return response.data || response;
    },

    async deleteApplication(id: string): Promise<void> {
        await httpClient.delete(`/api/applications/${id}/`);
    },
};
