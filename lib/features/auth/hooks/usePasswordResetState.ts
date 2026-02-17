"use client";

import { useState } from "react";
import { type PasswordResetStep } from "../types/auth.types";

interface UsePasswordResetStateReturn {
  currentStep: PasswordResetStep;
  token: string | null;
  goToRequestSuccess: () => void;
  goToReset: (token: string) => void;
  goToTokenInvalid: () => void;
  goToSuccess: () => void;
  goBackToRequest: () => void;
  setToken: (token: string) => void;
}

export function usePasswordResetState(): UsePasswordResetStateReturn {
  const [currentStep, setCurrentStep] = useState<PasswordResetStep>("REQUEST");
  const [token, setTokenState] = useState<string | null>(null);

  const goToRequestSuccess = () => setCurrentStep("REQUEST_SUCCESS");
  const goToReset = (newToken: string) => {
    setTokenState(newToken);
    setCurrentStep("RESET");
  };
  const goToTokenInvalid = () => setCurrentStep("TOKEN_INVALID");
  const goToSuccess = () => setCurrentStep("SUCCESS");
  const goBackToRequest = () => {
    setCurrentStep("REQUEST");
    setTokenState(null);
  };
  const setToken = (newToken: string) => setTokenState(newToken);

  return {
    currentStep,
    token,
    goToRequestSuccess,
    goToReset,
    goToTokenInvalid,
    goToSuccess,
    goBackToRequest,
    setToken,
  };
}
