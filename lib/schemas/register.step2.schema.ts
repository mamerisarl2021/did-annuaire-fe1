import { z } from "zod";

export const registerStep2Schema = z.object({
  admin_email: z.email("Format d'email invalide").min(1, "L'email de l'administrateur est requis"),

  admin_first_name: z
    .string()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),

  admin_last_name: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),

  admin_phone: z
    .string()
    .min(1, "Le numéro de téléphone est requis")
    .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres"),

  functions: z
    .string()
    .min(1, "La fonction est requise")
    .min(2, "La fonction doit contenir au moins 2 caractères")
    .max(100, "La fonction ne peut pas dépasser 100 caractères"),
});

/**
 * Inferred type from step 2 schema
 */
export type RegisterStep2Data = z.infer<typeof registerStep2Schema>;
