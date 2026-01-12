export const ActivationStep = {
  PASSWORD_SETUP: "PASSWORD_SETUP",
  OTP_SETUP: "OTP_SETUP",
  COMPLETE: "COMPLETE",
} as const;

export type ActivationStepType = (typeof ActivationStep)[keyof typeof ActivationStep];

export const OTPMethod = {
  TOTP: "TOTP",
  EMAIL: "EMAIL",
} as const;

export type OTPMethodType = (typeof OTPMethod)[keyof typeof OTPMethod];

export interface ActivationFlowState {
  currentStep: ActivationStepType;
  token: string | null;
  enableTotp: boolean;
  otpMethod: OTPMethodType | null;
  isComplete: boolean;
}
