"use client";

import { AlertCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApiException } from "@/lib/shared/api/api.errors";
import { cn } from "@/lib/utils";
import { ERROR_CONFIG } from "@/lib/shared/config/error.config";

interface ErrorAlertProps {
    error: ApiException | Error | string | null | undefined;
    title?: string;
    className?: string;
    showCode?: boolean;
    variant?: "destructive" | "default";
}

/**
 * Standard component to display errors in a consistent way.
 * Handles ApiException, standard Error, and strings.
 */
export function ErrorAlert({
    error,
    title,
    className,
    showCode = process.env.NODE_ENV === "development",
    variant = "destructive",
}: ErrorAlertProps) {
    if (!error) return null;

    const message = ApiException.getMessage(error);

    // Extract details from ApiException if present
    let errorCode: string | undefined;
    let requestId: string | undefined;

    if (error instanceof ApiException) {
        errorCode = error.code;
        requestId = error.requestId;
    }

    return (
        <Alert variant={variant} className={cn("animate-in fade-in slide-in-from-top-1", className)}>
            <XCircle className="h-4 w-4" />
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription className="space-y-2">
                <p>{message}</p>

                {showCode && (errorCode || requestId) && (
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono opacity-70">
                        {errorCode && <span>Code: {errorCode}</span>}
                        {requestId && <span>Request ID: {requestId}</span>}
                    </div>
                )}
            </AlertDescription>
        </Alert>
    );
}
