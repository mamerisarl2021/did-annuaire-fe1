"use client";

import { useState, useCallback, useEffect } from "react";
import { auditService } from "../services/audit.service";
import { type AuditAction, type AuditStats, type AuditListParams } from "../types/audit.types";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";

export function useAuditData(params: AuditListParams = {}) {
    const [logs, setLogs] = useState<AuditAction[]>([]);
    const [stats, setStats] = useState<AuditStats[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchParams = { ...params };
            if (user?.role !== "SUPER_USER") {
                delete fetchParams.organization_id;
            }

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
    }, [params, user?.role]);

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
