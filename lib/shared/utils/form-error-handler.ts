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
        }
    }
}
