import { useState, useCallback } from "react";
import { ApiException } from "../api/api.errors";

export function useApiError() {
    const [error, setErrorState] = useState<ApiException | null>(null);

    const setError = useCallback((err: unknown) => {
        if (err instanceof ApiException) {
            setErrorState(err);
        } else {
            setErrorState(new ApiException(0, err as any));
        }
    }, []);

    const clearError = useCallback(() => {
        setErrorState(null);
    }, []);

    return {
        error,
        setError,
        clearError,
    };
}
