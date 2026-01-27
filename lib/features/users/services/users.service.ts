import { httpClient } from "@/lib/shared/api/http.client";
import { API_ENDPOINTS } from "@/lib/shared/config/endpoints";
import {
  User,
  UserListResponse,
  CreateUserPayload,
  UpdateUserPayload,
  GetUsersParams,
  UserStats,
} from "../types/users.types";

/**
 * Users Service
 * Strictly handles HTTP requests related to Users
 */
export const usersService = {
  /**
   * Fetch a paginated list of users
   */
  async getUsers(params: GetUsersParams = {}): Promise<UserListResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.page_size) query.append("page_size", params.page_size.toString());
    if (params.status) query.append("status", params.status);
    if (params.search) query.append("search", params.search);
    if (params.role) query.append("role", params.role);
    if (params.org_id) query.append("org_id", params.org_id);

    const endpoint = `${API_ENDPOINTS.USERS.LIST}?${query.toString()}`;
    return await httpClient.get<UserListResponse>(endpoint, { requiresAuth: true });
  },

  /**
   * Create a new user (Status: PENDING)
   */
  async createUser(payload: CreateUserPayload): Promise<User> {
    return await httpClient.post<User>(API_ENDPOINTS.USERS.CREATE, payload, {
      requiresAuth: true,
    });
  },

  /**
   * Invite an existing user (Status: PENDING -> INVITED)
   */
  async inviteUser(userId: string): Promise<{ success: boolean }> {
    return await httpClient.post<{ success: boolean }>(
      API_ENDPOINTS.USERS.INVITE(userId),
      {},
      { requiresAuth: true }
    );
  },

  /**
   * Update user details
   */
  async updateUser(userId: string, payload: UpdateUserPayload): Promise<User> {
    return await httpClient.patch<User>(API_ENDPOINTS.USERS.UPDATE(userId), payload, {
      requiresAuth: true,
    });
  },

  /**
   * Get current authenticated user details (with full info including Org)
   */
  async getMe(): Promise<User> {
    return await httpClient.get<User>(API_ENDPOINTS.USERS.ME, { requiresAuth: true });
  },

  /**
   * Get users statistics
   */
  async getUsersStats(): Promise<UserStats> {
    const response = await httpClient.get<{ success: boolean; message: string; data: UserStats }>(
      API_ENDPOINTS.USERS.STATS,
      { requiresAuth: true }
    );
    return response.data;
  },
};
