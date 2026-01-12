import { z } from "zod";

/**
 * Maximum file size in bytes (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Allowed file types for document uploads
 */
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
] as const;

/**
 * File validation helper
 */
const fileSchema = z
  .custom<File>((val) => val instanceof File, "Fichier invalide")
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `La taille du fichier ne doit pas dépasser ${MAX_FILE_SIZE / (1024 * 1024)}MB`
  )
  .refine(
    (file) => ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number]),
    "Format de fichier non supporté. Utilisez PDF, JPEG ou PNG"
  );

/**
 * Step 3: Documents Schema
 */
export const registerStep3Schema = z.object({
  authorization_document: fileSchema,

  justification_document: z
    .custom<File | null>((val) => val === null || val instanceof File, "Fichier invalide")
    .optional()
    .nullable()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `La taille du fichier ne doit pas dépasser ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    )
    .refine(
      (file) =>
        !file || ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number]),
      "Format de fichier non supporté. Utilisez PDF, JPEG ou PNG"
    ),
});

/**
 * Inferred type from step 3 schema
 */
export type RegisterStep3Data = z.infer<typeof registerStep3Schema>;
