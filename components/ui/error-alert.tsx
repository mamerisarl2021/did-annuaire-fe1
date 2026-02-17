import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import { ApiException } from "@/lib/shared/api/api.errors";
import { cn } from "@/lib/utils";
import { ERROR_CONFIG } from "@/lib/shared/config/error.config";

interface ErrorAlertProps {
    error?: ApiException | Error | string | null;
    title?: string;
    className?: string;
    showIcon?: boolean;
}

export function ErrorAlert({
    error,
    title = ERROR_CONFIG.DEFAULT_ERROR_TITLE,
    className,
    showIcon = true,
}: ErrorAlertProps) {
    if (!error) return null;

    const message = ApiException.getMessage(error);

    let errorCode: string | undefined;
    if (error instanceof ApiException) {
        errorCode = error.code;
    }

    return (
        <Alert variant="destructive" className={cn("animate-in fade-in zoom-in duration-200", className)}>
            {showIcon && <XCircle className="h-4 w-4" />}
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription className="flex flex-col gap-1">
                <span>{message}</span>
                {errorCode && ERROR_CONFIG.SHOW_ERROR_CODES && (
                    <span className="text-[10px] font-mono opacity-70 uppercase tracking-wider">
                        Code: {errorCode}
                    </span>
                )}
            </AlertDescription>
        </Alert>
    );
}
