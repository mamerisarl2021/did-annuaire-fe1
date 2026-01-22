/**
 * @deprecated This hook is deprecated. Use useOTPForm + useOTPActions directly instead.
 *
 * This was a facade hook that provided no additional value.
 *
 * Migration example:
 * ```ts
 * // Before
 * const { form, verifyOTP, ... } = useOTPVerification({ method, onVerified });
 *
 * // After
 * const { form } = useOTPForm();
 * const { verifyOTP } = useOTPActions();
 * ```
 */

export function useOTPVerification() {
  throw new Error(
    "useOTPVerification is deprecated. Use useOTPForm + useOTPActions directly instead."
  );
}
