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
    .min(1, "Organization name is required")
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  org_type: z.string().min(1, "Organization type is required"),

  country: z.string().min(1, "Country is required"),

  email: z.email("Invalid email format").min(1, "Contact email is required"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(8, "Phone number must contain at least 8 digits"),

  address: z.string().min(1, "Postal address is required").min(10, "Address must be more detailed"),

  allowed_email_domains: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, "Domain is required")
          .regex(emailDomainPattern, "Invalid domain format (ex: example.com)"),
      })
    )
    .min(1, "At least one allowed email domain is required"),
});

export type RegisterStep1Data = z.infer<typeof registerStep1Schema>;

export const ORGANIZATION_TYPES = [
  { value: "ADMINISTRATION", label: "ADMINISTRATION" },
  { value: "ENTREPRISE", label: "ENTREPRISE" },
  { value: "PSCE", label: "PSCE" },
  { value: "OTHER", label: "OTHER" },
] as const;
