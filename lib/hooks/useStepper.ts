"use client";

import { useState, useCallback, useMemo } from "react";

export interface StepConfig {
  id: number;
  title: string;
  description: string;
}

interface UseStepperOptions {
  totalSteps: number;
  initialStep?: number;
}

interface UseStepperReturn {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  next: () => void;
  prev: () => void;
  goTo: (step: number) => void;
  reset: () => void;
}

export function useStepper({ totalSteps, initialStep = 1 }: UseStepperOptions): UseStepperReturn {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const progress = useMemo(() => {
    return Math.round((currentStep / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  const next = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const prev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goTo = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    progress,
    next,
    prev,
    goTo,
    reset,
  };
}
