"use client";

import { useState, useCallback } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activationSchema, type ActivationFormData } from "@/lib/schemas/activation.schema";
import {
  ActivationStep,
  type ActivationStepType,
  type OTPMethodType,
  OTPMethod,
} from "@/lib/types/activation";

interface UseActivationFlowReturn {
  currentStep: ActivationStepType;
  enableTotp: boolean;
  otpMethod: OTPMethodType;
  isComplete: boolean;

  passwordForm: UseFormReturn<ActivationFormData>;

  submitPasswordStep: (data: ActivationFormData) => void;
  completeOTPStep: () => void;
  reset: () => void;
}

export function useActivationFlow(): UseActivationFlowReturn {
  const [currentStep, setCurrentStep] = useState<ActivationStepType>(ActivationStep.PASSWORD_SETUP);
  const [enableTotp, setEnableTotp] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const passwordForm = useForm<ActivationFormData>({
    resolver: zodResolver(activationSchema),
    defaultValues: {
      password: "",
      password_confirm: "",
      enable_totp: false,
    },
    mode: "onBlur",
  });

  const submitPasswordStep = useCallback((data: ActivationFormData) => {
    setEnableTotp(data.enable_totp);

    if (data.enable_totp) {
      setCurrentStep(ActivationStep.OTP_SETUP);
    } else {
      setCurrentStep(ActivationStep.COMPLETE);
      setIsComplete(true);
    }

    console.log("Activation submitted:", {
      password: data.password,
      enable_totp: data.enable_totp,
    });
  }, []);

  const completeOTPStep = useCallback(() => {
    setCurrentStep(ActivationStep.COMPLETE);
    setIsComplete(true);

    console.log("OTP verification complete");
  }, []);
  const reset = useCallback(() => {
    setCurrentStep(ActivationStep.PASSWORD_SETUP);
    setEnableTotp(false);
    setIsComplete(false);
    passwordForm.reset();
  }, [passwordForm]);

  return {
    currentStep,
    enableTotp,
    otpMethod: enableTotp ? OTPMethod.TOTP : OTPMethod.EMAIL,
    isComplete,
    passwordForm,
    submitPasswordStep,
    completeOTPStep,
    reset,
  };
}
