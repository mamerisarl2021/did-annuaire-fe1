import { logger } from "../services/logger.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

logger.info(`API Base URL: ${API_BASE_URL || "(same domain)"}`);

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
    STATUS: (orgId: string) => `/api/organizations/id/${orgId}/status`,
  },
  USERS: {
    CREATE: "/api/users/",
    LIST: "/api/users/",
    UPDATE: (id: string) => `/api/users/${id}/update`,
    INVITE: (id: string) => `/api/users/${id}/invite`,
    ACTIVATE: "/api/users/activate",
    OTP_GENERATE: "/api/users/otp/email/generate",
    OTP_VERIFY: "/api/users/otp/email/verify",
    ME: "/api/users/me",
    DETAIL: (id: string) => `/api/users/${id}/info`,
    STATS: "/api/users/stats",
    TOGGLE_STATUS: (id: string) => `/api/users/${id}/toggle`,
    DELETE: (id: string) => `/api/users/${id}`,
    PASSWORD_RESET_REQUEST: "/api/users/password/reset-request",
    PASSWORD_RESET_CONFIRM: "/api/users/password/reset-confirm",
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
    DELETE: (id: string) => `/api/superadmin/organizations/${id}`,
    DIDS:{
      LIST: "/api/superadmin/dids",
      STATS: "/api/superadmin/dids/stats",
    },
    USERS: {
      LIST: "/api/superadmin/users",
      STATS:"/api/superadmin/users/stats",
    },
  },
  DID: {
    LIST: "/api/registry/dids",
    CREATE: "/api/registry/dids",
    PREVIEW: "/api/registry/dids/preview",
    CERTIFICATES: "/api/registry/certificates",
    CERTIFICATES_PREVIEW: "/api/registry/certificates/preview",
    METHODS: "/api/universal-registrar/methods",
    RESOLVE: (identifier: string) => `/api/universal-resolver/identifiers/${identifier}`,
    DETAILS: (id: string) => `/api/registry/dids/${id}/document`,
    KEYS: (id: string) => `/api/registry/dids/${id}/keys`,
    ROTATE: (id: string) => `/api/registry/dids/${id}/keys/rotate`,
    UPDATE: "/api/universal-registrar/update",
    PUBLISH: (id: string) => `/api/registry/dids/${id}/publish`,
    DEACTIVATE: "/api/universal-registrar/deactivate",
    STATS: "/api/registry/stats",
    RANDOM: "/api/registry/dids/random-urls",
  },
  PUBLISH_REQUESTS: {
    LIST: "/api/registry/publish-requests",
    STATS: "/api/registry/publish-requests/stats",
    APPROVE: (id: string) => `/api/registry/publish-requests/${id}/approve`,
    REJECT: (id: string) => `/api/registry/publish-requests/${id}/reject`,
  },
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
