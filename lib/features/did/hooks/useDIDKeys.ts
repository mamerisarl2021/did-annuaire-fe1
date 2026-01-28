import { useQuery } from "@tanstack/react-query";
import { didService } from "../services/did.service";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";

export function useDIDKeys(didId: string | null) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["did", didId, "keys"],
        queryFn: () => (didId ? didService.fetchKeys(didId) : Promise.resolve([])),
        enabled: !!didId,
        staleTime: QUERY_CONFIG.STALE_TIME_STANDARD,
    });

    const keys = (data || []).map((k) => ({
        id: k.key_id,
        publicKeyJwk: k.public_jwk,
    }));

    return {
        keys,
        isLoading,
        error: error instanceof Error ? error.message : null,
        refetch,
    };
}
