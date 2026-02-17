import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { ApiException } from "../api/api.errors";
import { FieldErrorMapper } from "./field-error-mapper";

interface HandleOptions<T extends FieldValues> {
  showToast?: boolean;
  showInline?: boolean;
  toastTitle?: string;
  fieldMapping?: Record<string, Path<T>>;
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
    options: HandleOptions<T> = {}
  ): void {
    const {
      showToast = true,
      showInline = true,
      toastTitle,
      fieldMapping,
      onFieldError,
      onGeneralError,
    } = options;

    if (!(error instanceof ApiException)) {
      if (showToast) showErrorToast(error);
      return;
    }

    const apiError = error;

    // 1. Handle validation errors (field errors)
    if (apiError.isValidationError() && apiError.hasFieldErrors()) {
      if (fieldMapping && apiError.fieldErrors) {
        const mappedErrors = FieldErrorMapper.mapBackendErrorsToFields(
          apiError.fieldErrors,
          fieldMapping as Record<string, string>
        );

        for (const [field, messages] of Object.entries(mappedErrors)) {
          form.setError(field as Path<T>, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : String(messages),
          });
        }
      } else {
        FieldErrorMapper.mapToForm(apiError, form.setError);
      }

      if (onFieldError) {
        onFieldError(apiError);
      }

      // If we don't show inline errors (Alert), we might want at least a toast
      if (!showInline && showToast) {
        showErrorToast(apiError, toastTitle);
      }
    }
    // 2. Handle general errors
    else {
      if (showToast) {
        showErrorToast(apiError, toastTitle);
      }

      if (onGeneralError) {
        onGeneralError(apiError);
      }
    }
  }

  /**
   * Legacy method for backward compatibility.
   */
  static handleFormError<T extends FieldValues>(
    error: unknown,
    form: UseFormReturn<T>,
    fieldMapping?: Record<string, Path<T>>,
    options: {
      setError?: (error: ApiException) => void;
      showToast?: (error: ApiException) => void;
    } = {}
  ) {
    if (!(error instanceof ApiException)) return;

    const apiError = error;

    if (apiError.fieldErrors) {
      const mappedErrors = fieldMapping
        ? FieldErrorMapper.mapBackendErrorsToFields(
            apiError.fieldErrors,
            fieldMapping as Record<string, string>
          )
        : apiError.fieldErrors;

      for (const [field, messages] of Object.entries(mappedErrors)) {
        form.setError(field as Path<T>, {
          type: "manual",
          message: messages[0],
        });
      }
    }

    if (options.setError) options.setError(apiError);
    if (options.showToast) options.showToast(apiError);
  }
}
