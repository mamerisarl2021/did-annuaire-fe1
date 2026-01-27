"use client";

import { useQuery } from "@tanstack/react-query";
import { auditService } from "../services/audit.service";
import { type AuditListParams } from "../types/audit.types";
import { type UserRoleType } from "@/lib/types/roles";

interface UseAuditDataOptions extends AuditListParams {
  userRole?: UserRoleType;
}

export function useAuditData(options: UseAuditDataOptions = {}) {
  const { userRole, ...params } = options;

  const fetchParams: AuditListParams = {
    category: params.category,
    action: params.action,
    user_id: params.user_id,
    severity: params.severity,
    date_from: params.date_from,
    date_to: params.date_to,
    q: params.q,
    limit: params.limit,
    offset: params.offset,
    organization_id: userRole === "SUPER_USER" ? params.organization_id : undefined,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["audit-logs", fetchParams],
    queryFn: async () => {
      const [actionsRes, statsRes] = await Promise.all([
        auditService.getAuditActions(fetchParams),
        auditService.getAuditStats({ organization_id: fetchParams.organization_id }),
      ]);

      return {
        logs: actionsRes.items,
        totalCount: actionsRes.count,
        stats: statsRes.items,
      };
    },
    staleTime: 30 * 1000, // 30 seconds - audit logs should be relatively fresh
  });

  return {
    logs: data?.logs || [],
    stats: data?.stats || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error: error ? (error as Error).message : null,
    refresh: refetch,
  };
}
