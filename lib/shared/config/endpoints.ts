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
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
