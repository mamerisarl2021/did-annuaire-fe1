import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { ApiException } from "../api/api.errors";

export class FieldErrorMapper {
    /**
     * Maps backend validation errors to react-hook-form fields.
     * @param error The ApiException containing field errors
     * @param setError The react-hook-form setError function
     */
    static mapToForm<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>): void {
        if (!(error instanceof ApiException) || !error.fieldErrors) {
            return;
        }

        Object.entries(error.fieldErrors).forEach(([field, messages]) => {
            // Handle the case where the backend field name might be slightly different
            // (e.g., snake_case vs camelCase)
            const formField = this.mapFieldName(field) as Path<T>;

            setError(formField, {
                type: "server",
                message: Array.isArray(messages) ? messages[0] : String(messages),
            });
        });
    }

    /**
     * Helper to get the first error message from field errors
     */
    static getFirstError(error: unknown): string | undefined {
        if (!(error instanceof ApiException) || !error.fieldErrors) {
            return undefined;
        }

        const firstField = Object.keys(error.fieldErrors)[0];
        if (!firstField) return undefined;

        const messages = error.fieldErrors[firstField];
        return Array.isArray(messages) ? messages[0] : String(messages);
    }

    /**
     * Map backend field names to frontend field names if they differ
     */
    private static mapFieldName(field: string): string {
        // Common mappings (example)
        const mappings: Record<string, string> = {
            // 'backend_field': 'frontendField',
        };

        return mappings[field] || field;
    }

    /**
     * Mappe les erreurs backend vers les noms de champs du formulaire (Legacy support if needed).
     */
    static mapBackendErrorsToFields(
        backendErrors: Record<string, string[]>,
        mapping: Record<string, string>
    ): Record<string, string[]> {
        const mappedErrors: Record<string, string[]> = {};

        for (const [backendField, errors] of Object.entries(backendErrors)) {
            const formField = mapping[backendField] || backendField;
            mappedErrors[formField] = errors;
        }

        return mappedErrors;
    }
}
