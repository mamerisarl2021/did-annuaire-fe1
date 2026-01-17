export type AuditSeverity = "INFO" | "WARNING" | "ERROR" | "CRITICAL";

export type AuditCategory = "ORGANIZATION" | "USER" | "DID" | "KEY" | "API" | "AUTH" | "SYSTEM";

export const AUDIT_CATEGORIES: AuditCategory[] = [
  "ORGANIZATION",
  "USER",
  "DID",
  "KEY",
  "API",
  "AUTH",
  "SYSTEM",
];

export interface AuditAction {
  id: string;
  timestamp: string;
  category: AuditCategory;
  action: string;
  severity: AuditSeverity;
  user: string | null; // Email
  organization: string | null; // Slug
  target_type?: string;
  target_id?: string;
  details?: Record<string, unknown>;
  ip?: string;
  user_agent?: string;
  request_id?: string;
}

export interface AuditStats {
  category: AuditCategory;
  count: number;
}

export interface AuditListParams {
  category?: string;
  action?: string;
  user_id?: string;
  severity?: string;
  date_from?: string;
  date_to?: string;
  q?: string;
  limit?: number;
  offset?: number;
  organization_id?: string;
}

export interface AuditListResponse {
  count: number;
  items: AuditAction[];
}
