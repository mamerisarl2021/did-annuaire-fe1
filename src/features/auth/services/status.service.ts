/**
 * Service de gestion des statuts d'organisation
 * =============================================
 *
 * Gestion de la state machine des statuts d'organisation.
 * Responsable uniquement de la communication avec l'API.
 */

import { OrganizationStatus, type OrganizationStatusData } from '../types/auth.types';

// ═══════════════════════════════════════════════════════════════
// SERVICE DE STATUT
// ═══════════════════════════════════════════════════════════════

/**
 * Récupère le statut d'une organisation
 */
export async function getOrganizationStatus(
  organizationId: string
): Promise<OrganizationStatusData> {
  // Mock pour développement - remplacer par l'API réelle
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simuler différents statuts pour les tests
      const mockStatuses: OrganizationStatus[] = [
        OrganizationStatus.PENDING,
        OrganizationStatus.ACTIVE,
        OrganizationStatus.REFUSED,
        OrganizationStatus.SUSPENDED,
      ];

      const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

      resolve({
        id: organizationId,
        status: randomStatus,
        organizationName: 'Organisation Test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        refusalReason:
          randomStatus === OrganizationStatus.REFUSED
            ? 'Documents incomplets ou non conformes'
            : undefined,
      });
    }, 500);
  });
}

/**
 * Déclenche l'envoi de l'OTP pour une organisation ACTIVE
 */
export async function sendOrganizationOtp(
  organizationId: string
): Promise<{ success: boolean; message: string }> {
  // Mock pour développement
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock envoi OTP pour organisation:', organizationId);
      resolve({
        success: true,
        message: 'Code OTP envoyé avec succès',
      });
    }, 500);
  });
}

/**
 * Contacte le super admin (création d'un ticket support)
 */
export async function contactSuperAdmin(
  organizationId: string,
  message: string
): Promise<{ success: boolean; message: string }> {
  // Mock pour développement
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock contact super admin:', { organizationId, message });
      resolve({
        success: true,
        message: 'Votre message a été transmis à notre équipe',
      });
    }, 500);
  });
}
