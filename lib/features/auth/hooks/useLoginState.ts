import { useState, useCallback } from "react";
import { type AuthUser } from "../types/auth.types";

export type LoginFlowStep = "CREDENTIALS" | "EMAIL_OTP_REQUIRED" | "TOTP_REQUIRED" | "SUCCESS";
export type OTPMethod = "email" | "totp" | null;

export function useLoginState() {
  const [currentStep, setCurrentStep] = useState<LoginFlowStep>("CREDENTIALS");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [otpMethod, setOtpMethod] = useState<OTPMethod>(null);
  const [otpSent, setOtpSent] = useState(false);

  const goToOTPStep = useCallback((method: "email" | "totp") => {
    setOtpMethod(method);
    setCurrentStep(method === "totp" ? "TOTP_REQUIRED" : "EMAIL_OTP_REQUIRED");
  }, []);

  const markOTPSent = useCallback(() => setOtpSent(true), []);

  const goToSuccess = useCallback((authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    setCurrentStep("SUCCESS");
  }, []);

  const goBackToCredentials = useCallback(() => {
    setCurrentStep("CREDENTIALS");
    setOtpSent(false);
    setOtpMethod(null);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep("CREDENTIALS");
    setUser(null);
    setOtpMethod(null);
    setOtpSent(false);
  }, []);

  return {
    currentStep,
    user,
    otpMethod,
    otpSent,
    goToOTPStep,
    markOTPSent,
    goToSuccess,
    goBackToCredentials,
    reset,
  };
}
