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
      title: "Organisation créée",
      description: "Votre demande a été soumise",
      status: "completed",
    },
    {
      id: 2,
      title: "Validation en cours",
      description: "Examen par un Super Admin",
      status: status === OrganizationStatus.PENDING ? "current" : "completed",
    },
    {
      id: 3,
      title: "Activation du compte",
      description: "Définition du mot de passe",
      status:
        status === OrganizationStatus.ACTIVE
          ? "current"
          : status === OrganizationStatus.PENDING
            ? "upcoming"
            : "upcoming",
    },
    {
      id: 4,
      title: "Accès au dashboard",
      description: "Gestion de votre organisation",
      status: "upcoming",
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
    label: "Validée",
    color: "text-green-700",
    bgColor: "bg-green-100",
    icon: "check",
  },
  PENDING: {
    label: "En attente",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    icon: "clock",
  },
  REFUSED: {
    label: "Refusée",
    color: "text-red-700",
    bgColor: "bg-red-100",
    icon: "x",
  },
  SUSPENDED: {
    label: "Suspendue",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    icon: "pause",
  },
};
