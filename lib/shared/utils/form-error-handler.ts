<<<<<<< HEAD
import { UseFormReturn, Path } from "react-hook-form";
import { ApiException } from "../api/api.errors";
import { FieldErrorMapper } from "./field-error-mapper";

export class FormErrorHandler {
    /**
     * Centralizes error handling for form submissions.
     */
    static handleFormError<T extends Record<string, any>>(
        error: unknown,
        form: UseFormReturn<T>,
        fieldMapping?: Record<string, Path<T>>,
        options: {
            setError?: (error: ApiException) => void;
            showToast?: (error: ApiException) => void;
        } = {}
    ) {
        if (!(error instanceof ApiException)) {
            return;
        }

        const apiError = error as ApiException;

        // Handle field errors
        if (apiError.fieldErrors) {
            const mappedErrors = fieldMapping
                ? FieldErrorMapper.mapBackendErrorsToFields(apiError.fieldErrors, fieldMapping)
                : apiError.fieldErrors;

            for (const [field, messages] of Object.entries(mappedErrors)) {
                form.setError(field as Path<T>, {
                    type: "manual",
                    message: messages[0],
                });
            }
        }

        // Handle global error
        if (options.setError) {
            options.setError(apiError);
        }

        // Specific toast if requested
        if (options.showToast) {
            options.showToast(apiError);
=======
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
>>>>>>> feature/exception
        }
    }
}
