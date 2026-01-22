import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLoginState } from "@/lib/features/auth/hooks/useLoginState";

describe("useLoginState", () => {
  it("should initialize with CREDENTIALS step", () => {
    const { result } = renderHook(() => useLoginState());

    expect(result.current.currentStep).toBe("CREDENTIALS");
    expect(result.current.user).toBeNull();
    expect(result.current.otpMethod).toBeNull();
    expect(result.current.otpSent).toBe(false);
  });

  it("should transition to EMAIL_OTP_REQUIRED step", () => {
    const { result } = renderHook(() => useLoginState());

    act(() => {
      result.current.goToOTPStep("email");
    });

    expect(result.current.currentStep).toBe("EMAIL_OTP_REQUIRED");
    expect(result.current.otpMethod).toBe("email");
  });

  it("should transition to TOTP_REQUIRED step", () => {
    const { result } = renderHook(() => useLoginState());

    act(() => {
      result.current.goToOTPStep("totp");
    });

    expect(result.current.currentStep).toBe("TOTP_REQUIRED");
    expect(result.current.otpMethod).toBe("totp");
  });

  it("should mark OTP as sent", () => {
    const { result } = renderHook(() => useLoginState());

    act(() => {
      result.current.markOTPSent();
    });

    expect(result.current.otpSent).toBe(true);
  });

  it("should go back to credentials", () => {
    const { result } = renderHook(() => useLoginState());

    act(() => {
      result.current.goToOTPStep("email");
      result.current.markOTPSent();
      result.current.goBackToCredentials();
    });

    expect(result.current.currentStep).toBe("CREDENTIALS");
    expect(result.current.otpSent).toBe(false);
    expect(result.current.otpMethod).toBeNull();
  });

  it("should transition to SUCCESS with user", () => {
    const { result } = renderHook(() => useLoginState());
    const mockUser = {
      id: "1",
      email: "test@example.com",
      role: "ORG_ADMIN" as const,
      organization_id: "org-1",
      is_active: true,
      full_name: "Test User",
    };

    act(() => {
      result.current.goToSuccess(mockUser);
    });

    expect(result.current.currentStep).toBe("SUCCESS");
    expect(result.current.user).toEqual(mockUser);
  });
});
