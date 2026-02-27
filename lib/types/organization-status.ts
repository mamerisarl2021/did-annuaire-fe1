/**
 * Organization Status Types
 * Represents the validation states of an organization
 */

/**
 * Organization validation status
 */
export const OrganizationStatus = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  REFUSED: "REFUSED",
  SUSPENDED: "SUSPENDED",
} as const;

export type OrganizationStatusType = (typeof OrganizationStatus)[keyof typeof OrganizationStatus];

/**
 * Registration tracking step
 */
export interface RegistrationStep {
  id: number;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
}

/**
 * Get registration steps based on organization status
 */
export function getRegistrationSteps(status: OrganizationStatusType): RegistrationStep[] {
  const steps: RegistrationStep[] = [
    {
      id: 1,
      title: "Organization Created",
      description: "Your request has been submitted",
      status: "completed",
    },
    {
      id: 2,
      title: "Validation in Progress",
      description: "Review by Super Admin",
      status: status === OrganizationStatus.PENDING ? "current" : "completed",
    },
    {
      id: 3,
      title: "Account Activation",
      description: "Password setup",
      status: status === OrganizationStatus.ACTIVE ? "completed" : "upcoming",
    },
  ];

  if (status === OrganizationStatus.REFUSED || status === OrganizationStatus.SUSPENDED) {
    steps[1].status = "completed";
    steps[2].status = "upcoming";
    steps[3].status = "upcoming";
  }

  return steps;
}

/**
 * Status display configuration
 */
export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: "clock" | "check" | "x" | "pause";
}

export const STATUS_CONFIG: Record<OrganizationStatusType, StatusConfig> = {
  ACTIVE: {
    label: "Validated",
    color: "text-green-700",
    bgColor: "bg-green-100",
    icon: "check",
  },
  PENDING: {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    icon: "clock",
  },
  REFUSED: {
    label: "Refused",
    color: "text-red-700",
    bgColor: "bg-red-100",
    icon: "x",
  },
  SUSPENDED: {
    label: "Suspended",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    icon: "pause",
  },
};
