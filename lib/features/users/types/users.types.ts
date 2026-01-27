import { UserRoleType } from "@/lib/types/roles";

export type UserStatus = "PENDING" | "INVITED" | "ACTIVE" | "DEACTIVATED";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  role: UserRoleType;
  status: UserStatus;
  functions: string;
  organization: string;
  totp_enabled?: boolean;
  created_at?: string;
  last_login?: string;
  updated_at?: string;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: {
    items: User[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_previous: boolean;
    };
  };
  code?: string;
  status_code: number;
}

export interface InviteUserPayload {
  user_id: string;
}

export interface CreateUserPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  functions: string;
  role: UserRoleType;
}

export interface UpdateUserPayload {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  functions?: string;
  status?: UserStatus;
}

export interface GetUsersParams {
  page?: number;
  page_size?: number;
  status?: string;
  search?: string;
  role?: string;
  org_id?: string;
}

export interface DeactivateUserPayload {
  user_id: string;
}

export interface UserStats {
  all: number;
  by_status: {
    pending: number;
    invited: number;
    active: number;
    deactivated: number;
  };
  by_role: {
    org_admin: number;
    org_member: number;
    auditor: number;
  };
}
