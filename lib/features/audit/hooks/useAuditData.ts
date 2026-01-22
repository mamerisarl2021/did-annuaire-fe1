"use client";

import { useState, useCallback, useEffect } from "react";
import { auditService } from "../services/audit.service";
import { type AuditAction, type AuditStats, type AuditListParams } from "../types/audit.types";
import { type UserRoleType } from "@/lib/types/roles";

interface UseAuditDataOptions extends AuditListParams {
  userRole?: UserRoleType;
}

export function useAuditData(options: UseAuditDataOptions = {}) {
  const { userRole, ...params } = options;

  const [logs, setLogs] = useState<AuditAction[]>([]);
  const [stats, setStats] = useState<AuditStats[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Destructure params to avoid object reference comparison issues
  const {
    category,
    action,
    user_id,
    severity,
    date_from,
    date_to,
    q,
    limit,
    offset,
    organization_id,
  } = params;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchParams: AuditListParams = {
        category,
        action,
        user_id,
        severity,
        date_from,
        date_to,
        q,
        limit,
        offset,
        organization_id: userRole === "SUPER_USER" ? organization_id : undefined,
      };

      const [actionsRes, statsRes] = await Promise.all([
        auditService.getAuditActions(fetchParams),
        auditService.getAuditStats({ organization_id: fetchParams.organization_id }),
      ]);

      setLogs(actionsRes.items);
      setTotalCount(actionsRes.count);
      setStats(statsRes.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch audit data");
    } finally {
      setIsLoading(false);
    }
  }, [
    category,
    action,
    user_id,
    severity,
    date_from,
    date_to,
    q,
    limit,
    offset,
    organization_id,
    userRole,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    logs,
    stats,
    totalCount,
    isLoading,
    error,
    refresh: fetchData,
  };
}
