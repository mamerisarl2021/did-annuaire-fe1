# Error Handling System

This document describes the unified error handling architecture for the frontend.

## Overview

The system is designed to provide:
1. **Consistency**: Same error display patterns across the entire app.
2. **Robustness**: Handles various backend error formats (Standard, Legacy, Network).
3. **UX-Friendly**: Translates technical codes into understandable French messages.
4. **Debuggability**: Includes request tracing (`X-Request-ID`) and debug info in development.

## Core Components

### 1. `ApiException` (`lib/shared/api/api.errors.ts`)
The base class for all API errors. It uses the `ErrorParser` to normalize errors and provides methods like `getUserMessage()`, `isValidationError()`, etc.

### 2. `ErrorParser` (`lib/shared/api/error-parser.ts`)
Internal utility that converts any raw error (Fetch Response, String, TypeError) into a consistent `NormalizedApiError` structure.

### 3. `ErrorMessageTranslator` (`lib/shared/utils/error-messages.ts`)
Maps English backend codes (e.g., `CREDENTIALS_INVALID`) to user-friendly French messages.

## UI Components

### `ErrorAlert` (`components/ui/error-alert.tsx`)
Inline component to display errors in forms or modals.
```tsx
<ErrorAlert error={error} />
```

### `useErrorToast` (`lib/shared/hooks/useErrorToast.tsx`)
Hook for displaying action-result toasts.
```tsx
const { showError, showSuccess } = useErrorToast();

// ...
try {
  await doAction();
  showSuccess("Succès !");
} catch (err) {
  showError(err, "Titre optionnel");
}
```

### `ErrorBoundary` (`components/ErrorBoundary.tsx`)
Catch-all for layout-level React errors.

## React Hook Patterns

### `useApiError` (`lib/shared/hooks/useApiError.ts`)
Manages error state for `useQuery` or `useMutation`.
```tsx
const { error, setError, clearError } = useApiError();

const { data } = useQuery({
  queryFn: async () => {
    try {
      return await service.get();
    } catch (err) {
      setError(err);
      throw err;
    }
  }
});
```

### `FormErrorHandler` (`lib/shared/utils/form-error-handler.ts`)
Helper for `react-hook-form` and common submission patterns.

## Best Practices

1. **Always catch API errors** in hooks and pass them to `setError` or `showError`.
2. **Prioritize `ErrorAlert`** for form validation or local context errors.
3. **Use Toasts** for background actions or page-level feedback.
4. **Check `X-Request-ID`** in the browser console when debugging with backend logs.
