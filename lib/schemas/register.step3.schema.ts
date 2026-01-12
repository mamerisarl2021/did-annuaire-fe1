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
  .custom<File>((val) => val instanceof File, "Invalid file")
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `File size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`
  )
  .refine(
    (file) => ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number]),
    "Unsupported file format. Use PDF, JPEG or PNG"
  );

/**
 * Step 3: Documents Schema
 */
export const registerStep3Schema = z.object({
  authorization_document: fileSchema,

  justification_document: z
    .custom<File | null>((val) => val === null || val instanceof File, "Invalid file")
    .optional()
    .nullable()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `File size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    )
    .refine(
      (file) =>
        !file || ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number]),
      "Unsupported file format. Use PDF, JPEG or PNG"
    ),
});

/**
 * Inferred type from step 3 schema
 */
export type RegisterStep3Data = z.infer<typeof registerStep3Schema>;
