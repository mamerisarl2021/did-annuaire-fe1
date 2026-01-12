import { multipartClient } from "@/lib/shared/api/multipart.client";
import { httpClient } from "@/lib/shared/api/http.client";
import { API_ENDPOINTS } from "@/lib/shared/config/endpoints";
import { type OrgCreatePayload, type OrgCreateResponse } from "../types/organization.types";
import { organizationMapper } from "../mappers/organization.mapper";
import { type OrganizationStatusType } from "@/lib/types/organization-status";

export const organizationService = {
  /**
   * Create a new organization with documents
   */
  async createOrganization(payload: OrgCreatePayload): Promise<OrgCreateResponse> {
    const formData = organizationMapper.toFormData(payload);

    return await multipartClient.upload<OrgCreateResponse>(
      API_ENDPOINTS.ORGANIZATIONS.CREATE,
      formData,
      { requiresAuth: false }
    );
  },

  /**
   * Get organization status
   */
  async getStatus(id: string): Promise<OrganizationStatusType> {
    const response = await httpClient.get<{ status: OrganizationStatusType }>(
      API_ENDPOINTS.ORGANIZATIONS.STATUS(id),
      { requiresAuth: false }
    );
    return response.status;
  },
};
