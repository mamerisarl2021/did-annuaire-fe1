import { z } from "zod";

const emailDomainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export const registerStep1Schema = z.object({
  name: z
    .string()
    .min(1, "Le nom de l'organisation est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),

  org_type: z.string().min(1, "Le type d'organisation est requis"),

  country: z.string().min(1, "Le pays est requis"),

  email: z.email("Format d'email invalide").min(1, "L'email de contact est requis"),

  phone: z
    .string()
    .min(1, "Le numéro de téléphone est requis")
    .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres"),

  address: z
    .string()
    .min(1, "L'adresse postale est requise")
    .min(10, "L'adresse doit être plus détaillée"),

  allowed_email_domains: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, "Le domaine est requis")
          .regex(emailDomainPattern, "Format de domaine invalide (ex: example.com)"),
      })
    )
    .min(1, "Au moins un domaine email autorisé est requis"),
});

export type RegisterStep1Data = z.infer<typeof registerStep1Schema>;

export const ORGANIZATION_TYPES = [
  { value: "ADMINISTRATION", label: "ADMINISTRATION" },
  { value: "ENTREPRISE", label: "ENTREPRISE" },
  { value: "PSCE", label: "PSCE" },
  { value: "OTHER", label: "OTHER" },
] as const;
