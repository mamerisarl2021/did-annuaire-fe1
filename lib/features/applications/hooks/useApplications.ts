import { useState, useEffect, useCallback } from "react";
import { applicationService } from "../services/application.service";
import {
    Application,
    ApplicationListParams,
} from "../types/application.types";

export function useApplications() {
    const [applications, setApplications] = useState<Application[]>([]);

    // Pagination State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    // Filters
    const [search, setSearch] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch Data
     */
    const fetchApplications = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params: ApplicationListParams = {
                page,
                page_size: pageSize,
                search: search || undefined,
            };

            const { data } = await applicationService.getApplications(params);
            setApplications(data.results);
            setTotalCount(data.count);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error loading applications");
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, search]);

    // Initial Load & Updates
    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    return {
        applications,
        isLoading,
        error,
        pagination: {
            page,
            pageSize,
            count: totalCount,
            setPage,
            setPageSize,
        },
        refresh: fetchApplications,
        filters: {
            search,
            setSearch,
        },
    };
}
