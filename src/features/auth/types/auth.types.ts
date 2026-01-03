/**
 * Types d'authentification
 * ========================
 *
 * Définitions TypeScript pour l'authentification.
 * Types inférés automatiquement depuis les schémas Zod.
 */

import type { z } from 'zod';
import type { loginSchema, registerSchema, otpSchema } from '../schemas/auth.schema';

// ═══════════════════════════════════════════════════════════════
// TYPES DE FORMULAIRES
// ═══════════════════════════════════════════════════════════════

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;

// ═══════════════════════════════════════════════════════════════
// TYPES D'API
// ═══════════════════════════════════════════════════════════════

export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  idd: {
    root: string;
    suffixes: string[];
  };
  flags: {
    png: string;
    svg: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    user?: {
      id: string;
      email: string;
      organizationName: string;
    };
  };
}

export interface OtpResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      organizationName: string;
    };
  };
}

// ═══════════════════════════════════════════════════════════════
// TYPES D'ÉTAT
// ═══════════════════════════════════════════════════════════════

export interface RegisterState {
  currentStep: number;
  formData: Partial<RegisterFormData>;
  isSubmitting: boolean;
  showOtpModal: boolean;
}

export type OrganizationType = 
  | 'entreprise'
  | 'association'
  | 'collectivite'
  | 'etablissement_public'
  | 'autre';