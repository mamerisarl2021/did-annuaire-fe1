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
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

// ═══════════════════════════════════════════════════════════════
// SCHÉMA D'INSCRIPTION (3 ÉTAPES)
// ═══════════════════════════════════════════════════════════════

export const registerSchema = z.object({
  // Étape 1 - Organisation
  organizationName: z
    .string()
    .min(1, 'Le nom de l\'organisation est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  
  organizationType: z.enum([
    'entreprise',
    'association', 
    'collectivite',
    'etablissement_public',
    'autre'
  ], {
    required_error: 'Le type d\'organisation est requis',
    invalid_type_error: 'Type d\'organisation invalide'
  }),
  
  country: z
    .string()
    .min(1, 'Le pays est requis')
    .length(2, 'Code pays invalide'),
  
  organizationEmail: z
    .string()
    .min(1, 'L\'email de contact est requis')
    .email('Format d\'email invalide'),
  
  phone: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .regex(/^\+[1-9]\d{1,14}$/, 'Format de téléphone invalide'),

  // Étape 2 - Administrateur
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
  
  adminEmail: z
    .string()
    .min(1, 'L\'email professionnel est requis')
    .email('Format d\'email invalide'),

  // Étape 3 - Document
  document: z
    .instanceof(File, { message: 'Un document justificatif est requis' })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'Le fichier ne doit pas dépasser 5 Mo'
    )
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
// SCHÉMAS PARTIELS POUR LES ÉTAPES
// ═══════════════════════════════════════════════════════════════

export const step1Schema = registerSchema.pick({
  organizationName: true,
  organizationType: true,
  country: true,
  organizationEmail: true,
  phone: true,
});

export const step2Schema = registerSchema.pick({
  adminFirstName: true,
  adminLastName: true,
  adminEmail: true,
});

export const step3Schema = registerSchema.pick({
  document: true,
});