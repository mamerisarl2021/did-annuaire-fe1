import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLoginForm } from '@/lib/features/auth/hooks/useLoginForm';

describe('useLoginForm', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.getValues()).toEqual({
      email: '',
      password: '',
    });
  });

  it('should validate email format', async () => {
  const { result } = renderHook(() => useLoginForm());

  result.current.setValue('email', 'invalid-email', {
    shouldValidate: true,
    shouldTouch: true,
  });

  await waitFor(() => {
    expect(result.current.formState.errors.email).toBeDefined();
  });
});


  it('should accept valid email', async () => {
    const { result } = renderHook(() => useLoginForm());
    result.current.setValue('email', 'test@example.com', {
      shouldValidate: true,
      shouldTouch: true,
    });

    await waitFor(() => {
      expect(result.current.formState.errors.email).toBeUndefined();
    });
  });
});
