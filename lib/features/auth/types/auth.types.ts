import { type UserRoleType } from "@/lib/types/roles";

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
  organization_id?: string;
  is_active: boolean;
  full_name?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
