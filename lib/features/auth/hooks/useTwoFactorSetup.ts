"use client";

import { useState, useCallback } from "react";
import { authService } from "../services/auth.service";
import { type QRCodeData } from "../schemas/activate.schema";

interface UseTwoFactorSetupOptions {
  /** Called when 2FA setup is complete */
  onSetupComplete?: () => void;
}

interface UseTwoFactorSetupReturn {
  qrCodeData: QRCodeData | null;
  isSettingUp: boolean;
  isVerifying: boolean;
  error: string | null;
  isVerified: boolean;
  setQrCode: (data: QRCodeData) => void;
  verifyCode: (code: string) => Promise<boolean>;
  reset: () => void;
}

export function useTwoFactorSetup({
  onSetupComplete,
}: UseTwoFactorSetupOptions = {}): UseTwoFactorSetupReturn {
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Set QR code data received from activation
   */
  const setQrCode = useCallback((data: QRCodeData) => {
    setQrCodeData(data);
    setIsSettingUp(true);
    setIsVerified(false);
    setError(null);
  }, []);

  /**
   * Verify the TOTP code from authenticator app
   */
  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      if (!code || code.length !== 6) {
        setError("Le code doit contenir 6 chiffres.");
        return false;
      }

      setIsVerifying(true);
      setError(null);

      try {
        // Use OTP verification (no auth required, body: { otp } only)
        await authService.verifyActivationOTP(code);
        setIsVerified(true);
        setIsSettingUp(false);
        onSetupComplete?.();
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Code OTP invalide ou expiré.";
        setError(message);
        return false;
      } finally {
        setIsVerifying(false);
      }
    },
    [onSetupComplete]
  );

  /**
   * Reset the 2FA setup state
   */
  const reset = useCallback(() => {
    setQrCodeData(null);
    setIsSettingUp(false);
    setIsVerifying(false);
    setIsVerified(false);
    setError(null);
  }, []);

  return {
    qrCodeData,
    isSettingUp,
    isVerifying,
    error,
    isVerified,
    setQrCode,
    verifyCode,
    reset,
  };
}
