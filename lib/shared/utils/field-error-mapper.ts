/**
 * Mappe les erreurs de validation backend aux noms de champs react-hook-form.
 */
export class FieldErrorMapper {
    /**
     * Mappe les erreurs backend vers les noms de champs du formulaire.
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
