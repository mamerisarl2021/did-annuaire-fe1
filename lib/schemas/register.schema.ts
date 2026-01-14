import { z } from "zod";
import { registerStep1Schema, type RegisterStep1Data } from "./register.step1.schema";
import { registerStep2Schema, type RegisterStep2Data } from "./register.step2.schema";
import { registerStep3Schema, type RegisterStep3Data } from "./register.step3.schema";

export const registerSchema = registerStep1Schema
  .extend(registerStep2Schema.shape)
  .extend(registerStep3Schema.shape);

export type RegisterFormData = z.infer<typeof registerSchema>;
export {
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
  type RegisterStep1Data,
  type RegisterStep2Data,
  type RegisterStep3Data,
};

export const REGISTER_STEPS = [
  {
    id: 1,
    title: "Organization",
    description: "Organization Information",
    schema: registerStep1Schema,
  },
  {
    id: 2,
    title: "Administrator",
    description: "Main administrator information",
    schema: registerStep2Schema,
  },
  {
    id: 3,
    title: "Documents",
    description: "Supporting documents",
    schema: registerStep3Schema,
  },
] as const;

/**
 * @note Uniqueness validations (TO BE IMPLEMENTED SERVER-SIDE):
 * - name (organization slug) uniqueness
 * - email (organization contact) uniqueness
 * - admin_email uniqueness
 */
