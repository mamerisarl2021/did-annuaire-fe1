import { useToast } from "@/components/ui/use-toast";
import { ApiException } from "../api/api.errors";
import { ERROR_CONFIG } from "../config/error.config";
import React from "react";

/**
 * Hook to display standardized error and success toasts.
 */
export function useErrorToast() {
    const { toast } = useToast();

    const showError = (error: ApiException | Error | string | null | undefined, title?: string) => {
        if (!error) return;

        const message = ApiException.getMessage(error);

        let errorCode: string | undefined;

        if (error instanceof ApiException) {
            errorCode = error.code;
        }

        toast({
            variant: "destructive",
            title: title || ERROR_CONFIG.DEFAULT_ERROR_TITLE,
            description: (
                <div className="flex flex-col gap-1">
                    <span>{message}</span>
                    {errorCode && process.env.NODE_ENV === "development" && (
                        <span className="text-[10px] font-mono opacity-70">Code: {errorCode}</span>
                    )}
                </div>
            ) as any,
            duration: ERROR_CONFIG.TOAST_DURATION,
        });
    };

    const showSuccess = (message: string, title?: string) => {
        toast({
            variant: "default",
            title: title || ERROR_CONFIG.DEFAULT_SUCCESS_TITLE,
            description: message,
            duration: ERROR_CONFIG.TOAST_DURATION,
        });
    };

    return {
        showError,
        showSuccess,
    };
}
