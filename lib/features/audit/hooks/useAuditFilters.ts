"use client";

import { useState, useCallback, useMemo } from "react";
import { type AuditListParams } from "../types/audit.types";

export function useAuditFilters(initialLimit = 50) {
    const [q, setQ] = useState("");
    const [category, setCategory] = useState("all");
    const [severity, setSeverity] = useState("all");
    const [organizationId, setOrganizationId] = useState<string | undefined>(undefined);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(initialLimit);

    const filters = useMemo((): AuditListParams => ({
        q: q.trim() || undefined,
        category: category === "all" ? undefined : category,
        severity: severity === "all" ? undefined : severity,
        organization_id: organizationId,
        limit,
        offset,
    }), [q, category, severity, organizationId, limit, offset]);

    const handleSearchChange = useCallback((value: string) => {
        setQ(value);
        setOffset(0);
    }, []);

    const handleCategoryChange = useCallback((value: string) => {
        setCategory(value);
        setOffset(0);
    }, []);

    const handleSeverityChange = useCallback((value: string) => {
        setSeverity(value);
        setOffset(0);
    }, []);

    const handlePageChange = useCallback((newOffset: number) => {
        setOffset(newOffset);
    }, []);

    return {
        q,
        category,
        severity,
        organizationId,
        offset,
        limit,
        filters,
        setQ: handleSearchChange,
        setCategory: handleCategoryChange,
        setSeverity: handleSeverityChange,
        setOrganizationId,
        setOffset: handlePageChange,
        setLimit,
    };
}
