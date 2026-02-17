import { type UserRoleType } from "@/lib/types/roles";
import { UserStatus } from "../../users/types/users.types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenVerifyPayload {
  token: string;
}

export interface TokenRefreshPayload {
  refresh: string;
}

export interface TokenPairResponse {
  access: string;
  refresh: string;
  access_expires_at?: string;
  refresh_expires_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRoleType;
  roles: string[];
  organization_id?: string;
  organization?: {
    id: string;
    name: string;
  };
  is_active: boolean;
  full_name?: string;
  functions?: string[];
  status?: UserStatus;
  phone?: string;
  totp_enabled?: boolean;
  can_publish_prod?: boolean;
  last_login?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Password Reset Types
export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  token: string;
  new_password: string;
}

export interface PasswordResetResponse {
  message: string;
}

export type PasswordResetStep =
  | "REQUEST" // Formulaire email
  | "REQUEST_SUCCESS" // Email envoyé
  | "TOKEN_INVALID" // Token expiré/invalide
  | "RESET" // Formulaire nouveau password
  | "SUCCESS"; // Password changé
