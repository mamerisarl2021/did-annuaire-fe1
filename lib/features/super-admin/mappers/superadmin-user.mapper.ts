import { User, UserStatus } from "../../users/types/users.types";
import { authMapper } from "../../auth/mappers/auth.mapper";

export const superAdminUserMapper = {
  toDomain(apiData: Record<string, unknown>): User {
    const firstName = (apiData.first_name as string) || "";
    const lastName = (apiData.last_name as string) || "";

    return {
      id: apiData.id as string,
      email: apiData.email as string,
      first_name: apiData.first_name as string,
      last_name: apiData.last_name as string,
      full_name: `${firstName} ${lastName}`.trim(),
      phone: (apiData.phone as string) || "",
      role: authMapper.normalizeRole(apiData.roles as string[]),
      status: (apiData.status as UserStatus) || "PENDING",
      functions: (apiData.functions as string[]) || [],
      organization: (apiData.organization_name as string) || "",
      can_publish_prod: apiData.can_publish_prod as boolean,
      is_auditor: ((apiData.roles as string[]) || []).includes("AUDITOR"),
      created_at: apiData.created_at as string,
      last_login: apiData.last_login as string,
    };
  },

  toDomainList(items: Record<string, unknown>[]): User[] {
    return items.map((item) => this.toDomain(item));
  },
};
