/**
 * Service d'authentification
 * ==========================
 *
 * Responsable uniquement de la communication avec l'API.
 * Aucune logique UI - fonctions pures.
 */

import axios from 'axios';
import type {
  LoginFormData,
  RegisterFormData,
  OtpFormData,
  AuthResponse,
  OtpResponse,
  Country,
} from '../types/auth.types';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

// Configuration axios pour usage futur
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// ═══════════════════════════════════════════════════════════════
// SERVICES D'AUTHENTIFICATION
// ═══════════════════════════════════════════════════════════════

/**
 * Connexion utilisateur
 */
export async function loginUser(data: LoginFormData): Promise<AuthResponse> {
  // Mock pour développement - remplacer par l'API réelle
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock connexion:', data);
      resolve({
        success: true,
        message: 'Connexion réussie',
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 'mock-user-id',
            email: data.email,
            organizationName: 'Organisation Test',
          },
        },
      });
    }, 1000);
  });
}

/**
 * Inscription d'une organisation
 */
export async function registerOrganization(data: RegisterFormData): Promise<AuthResponse> {
  // Mock pour développement - remplacer par l'API réelle
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock inscription:', data);
      resolve({
        success: true,
        message: 'Inscription soumise avec succès',
        data: {
          organizationId: 'mock-org-' + Date.now(),
          user: {
            id: 'mock-user-id',
            email: data.adminEmail,
            organizationName: data.organizationName,
          },
        },
      });
    }, 1500);
  });
}

/**
 * Validation du code OTP
 */
export async function verifyOtp(data: OtpFormData): Promise<OtpResponse> {
  // Mock pour développement - remplacer par l'API réelle
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock OTP:', data);
      if (data.code === '123456') {
        resolve({
          success: true,
          message: 'Vérification réussie',
          data: {
            token: 'mock-jwt-token',
            user: {
              id: 'mock-user-id',
              email: 'admin@organisation.com',
              organizationName: 'Organisation Test',
            },
          },
        });
      } else {
        resolve({
          success: false,
          message: 'Code de vérification invalide',
        });
      }
    }, 800);
  });
}

/**
 * Renvoyer un code OTP
 */
export async function resendOtp(): Promise<AuthResponse> {
  // Mock pour développement - remplacer par l'API réelle
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Code renvoyé avec succès',
      });
    }, 500);
  });
}

// ═══════════════════════════════════════════════════════════════
// SERVICE PAYS
// ═══════════════════════════════════════════════════════════════

/**
 * Récupération de la liste des pays
 */
export async function fetchCountries(): Promise<Country[]> {
  try {
    const response = await axios.get(
      'https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags'
    );

    return response.data
      .filter((country: Country) => country.idd?.root && country.idd?.suffixes)
      .sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common, 'fr'));
  } catch (error) {
    console.error('Erreur lors du chargement des pays:', error);
    return [];
  }
}
