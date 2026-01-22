const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    CREATE: "/api/users/",
    LIST: "/api/users/",
    UPDATE: (id: string) => `/api/users/${id}/update`,
    INVITE: (id: string) => `/api/users/${id}/invite`,
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
  },
  DID: {
    LIST: "/api/registry/dids",
    CREATE: "/api/registry/dids",
    PREVIEW: "/api/registry/dids/preview",
    CERTIFICATES: "/api/registry/certificates",
    METHODS: "/api/universal-registrar/methods",
    RESOLVE: (identifier: string) => `/api/universal-resolver/identifiers/${identifier}`,
    DETAILS: (id: string) => `/api/registry/dids/${id}/document`,
    KEYS: (id: string) => `/api/registry/dids/${id}/keys`,
    ROTATE: (id: string) => `/api/registry/dids/${id}/keys/rotate`,
    UPDATE: "/api/universal-registrar/update",
    PUBLISH: (id: string) => `/api/registry/dids/${id}/publish`,
    DEACTIVATE: "/api/universal-registrar/deactivate",
  },
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
