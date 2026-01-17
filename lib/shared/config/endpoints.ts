const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/token/pair",
    REFRESH: "/api/token/refresh",
    VERIFY: "/api/token/verify",
    LOGOUT: "/api/auth/logout",
  },
  ORGANIZATIONS: {
    CREATE: "/api/organizations/",
    DETAILS: (id: string) => `/api/organizations/id/${id}`,
    LIST: "/api/organizations/",
    STATS: "/api/organizations/stats",
  },
  USERS: {
    ACTIVATE: "/api/users/activate",
    OTP_GENERATE: "/api/users/otp/email/generate",
    OTP_VERIFY: "/api/users/otp/email/verify",
    ME: "/api/users/me",
    DETAIL: (id: string) => `/api/users/${id}/`,
  },
  AUDIT: {
    ACTIONS: "/api/audit/actions",
    STATS_CATEGORY: "/api/audit/stats/by-category",
  },
  SUPERADMIN: {
    LIST: "/api/superadmin/organizations",
    STATS: "/api/superadmin/organizations/stats",
    DETAILS: (id: string) => `/api/superadmin/organizations/${id}`,
    VALIDATE: (id: string) => `/api/superadmin/organizations/${id}/validate`,
    REFUSE: (id: string) => `/api/superadmin/organizations/${id}/refuse`,
    TOGGLE_ACTIVATION: (id: string) => `/api/superadmin/organizations/${id}/toggle-activation`,
    DELETE: (id: string) => `/api/superadmin/organizations/${id}/delete`,
  }
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
