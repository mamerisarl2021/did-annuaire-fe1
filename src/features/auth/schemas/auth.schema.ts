/**
 * Schémas de validation d'authentification
 * ========================================
 *
 * Schémas Zod pour la validation côté client.
 * Messages d'erreur en français pour l'utilisateur.
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// SCHÉMA DE CONNEXION
// ═══════════════════════════════════════════════════════════════

export const loginSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

// ═══════════════════════════════════════════════════════════════
// SCHÉMA D'INSCRIPTION (2 ÉTAPES - REFONTE)
// ═══════════════════════════════════════════════════════════════

export const registerSchema = z.object({
  // Étape 1 - Informations organisationnelles
  organizationName: z
    .string()
    .min(1, "Le nom de l'organisation est requis")
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),

  organizationType: z.enum(['Administration', 'Entreprise', 'PSCE', 'Autre'], {
    message: "Le type d'organisation est requis",
  }),

  country: z.string().min(1, 'Le pays est requis').length(2, 'Code pays invalide'),

  address: z
    .string()
    .min(1, "L'adresse complète est requise")
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(200, "L'adresse ne peut pas dépasser 200 caractères"),

  organizationEmail: z
    .string()
    .min(1, "L'email de contact est requis")
    .email("Format d'email invalide"),

  phone: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .regex(/^\+[1-9]\d{1,14}$/, 'Format de téléphone invalide'),

  domains: z
    .array(
      z.string().regex(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i, 'Format de domaine invalide')
    )
    .min(1, 'Au moins un domaine est requis')
    .max(10, 'Maximum 10 domaines autorisés'),

  activityDocument: z
    .instanceof(File, { message: 'Document justificatif' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Le fichier ne doit pas dépasser 5 Mo')
    .refine(
      (file) => file.type === 'application/pdf',
      'Format de fichier non supporté (PDF uniquement)'
    )
    .optional(),

  // Étape 2 - Informations administratives
  adminFirstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),

  adminLastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),

  adminEmail: z.string().min(1, "L'email est requis").email("Format d'email invalide"),

  adminFunction: z
    .string()
    .min(1, "La fonction de l'administrateur est requise")
    .min(2, 'La fonction doit contenir au moins 2 caractères')
    .max(100, 'La fonction ne peut pas dépasser 100 caractères'),

  authorizationDocument: z
    .instanceof(File, { message: "Le document d'autorisation est requis" })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Le fichier ne doit pas dépasser 5 Mo')
    .refine(
      (file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
      'Format de fichier non supporté (PDF, JPEG, PNG uniquement)'
    ),
});

// ═══════════════════════════════════════════════════════════════
// SCHÉMA OTP
// ═══════════════════════════════════════════════════════════════

export const otpSchema = z.object({
  code: z
    .string()
    .min(1, 'Le code de vérification est requis')
    .length(6, 'Le code doit contenir 6 chiffres')
    .regex(/^\d{6}$/, 'Le code doit contenir uniquement des chiffres'),
});

// ═══════════════════════════════════════════════════════════════
// SCHÉMAS PARTIELS POUR LES ÉTAPES (2 ÉTAPES)
// ═══════════════════════════════════════════════════════════════

export const step1Schema = registerSchema.pick({
  organizationName: true,
  organizationType: true,
  country: true,
  address: true,
  organizationEmail: true,
  phone: true,
  domains: true,
  activityDocument: true,
});

export const step2Schema = registerSchema.pick({
  adminFirstName: true,
  adminLastName: true,
  adminEmail: true,
  adminFunction: true,
  authorizationDocument: true,
});
