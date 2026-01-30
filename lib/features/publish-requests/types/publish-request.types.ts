export type PublishRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PublishRequest {
  id: string;
  did: string;
  version: number;
  environment: string;
  status: PublishRequestStatus;
  requested_by: string;
  decided_by: string | null;
  decided_at: string | null;
  note: string | null;
}

export interface PublishRequestListParams {
  org_id: string;
  status?: string;
  offset?: number;
  limit?: number;
}

export interface PublishRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface ApprovePayload {
  note?: string;
}

export interface RejectPayload {
  note?: string;
}
