import { UseFormReturn, FieldValues } from "react-hook-form";
import { ApiException } from "../api/api.errors";
import { FieldErrorMapper } from "./field-error-mapper";

interface HandleOptions {
    showToast?: boolean;
    showInline?: boolean;
    toastTitle?: string;
    onFieldError?: (error: ApiException) => void;
    onGeneralError?: (error: ApiException) => void;
}

/**
 * Utility to centralize form error handling.
 */
export class FormErrorHandler {
    /**
     * Automatically handles different types of API errors for a form.
     */
    static handle<T extends FieldValues>(
        error: unknown,
        form: UseFormReturn<T>,
        showErrorToast: (err: unknown, title?: string) => void,
        options: HandleOptions = {}
    ): void {
        const {
            showToast = true,
            showInline = true,
            toastTitle,
            onFieldError,
            onGeneralError
        } = options;

        if (!(error instanceof ApiException)) {
            if (showToast) showErrorToast(error);
            return;
        }

        // 1. Handle validation errors (field errors)
        if (error.isValidationError() && error.hasFieldErrors()) {
            FieldErrorMapper.mapToForm(error, form.setError);

            if (onFieldError) {
                onFieldError(error);
            }

            // If we don't show inline errors (Alert), we might want at least a toast
            if (!showInline && showToast) {
                showErrorToast(error, toastTitle);
            }
        }
        // 2. Handle general errors
        else {
            if (showToast) {
                showErrorToast(error, toastTitle);
            }

            if (onGeneralError) {
                onGeneralError(error);
            }
        }
    }
}
