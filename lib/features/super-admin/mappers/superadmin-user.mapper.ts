import { User, UserStatus } from "../../users/types/users.types";
import { authMapper } from "../../auth/mappers/auth.mapper";

export const superAdminUserMapper = {
  toDomain(apiData: Record<string, any>): User {
    const firstName = apiData.first_name || "";
    const lastName = apiData.last_name || "";

    return {
      id: apiData.id,
      email: apiData.email,
      first_name: apiData.first_name,
      last_name: apiData.last_name,
      full_name: `${firstName} ${lastName}`.trim(),
      phone: apiData.phone || "",
      role: authMapper.normalizeRole(apiData.roles),
      status: (apiData.status as UserStatus) || "PENDING",
      functions: apiData.functions || [],
      organization: apiData.organization_name || "",
      can_publish_prod: apiData.can_publish_prod,
      is_auditor: (apiData.roles || []).includes("AUDITOR"),
      created_at: apiData.created_at,
      last_login: apiData.last_login,
    };
  },

  toDomainList(items: any[]): User[] {
    return items.map((item) => this.toDomain(item));
  },
};
