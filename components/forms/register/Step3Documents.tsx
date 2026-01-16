"use client";

import * as React from "react";
import { type UseFormReturn, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/forms/ui/FileUpload";
import type { RegisterFormData } from "@/lib/schemas/register.schema";

interface Step3DocumentsProps {
  form: UseFormReturn<RegisterFormData>;
  className?: string;
}

/**
 * Step 3: Documents Upload Form
 * Pure UI component - receives form from parent
 */
export function Step3Documents({ form, className }: Step3DocumentsProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Supporting Documents</h2>
        <p className="text-sm text-muted-foreground">
          Please provide the necessary documents to validate your registration request. These
          documents will be reviewed by our team.
        </p>
      </div>

      {/* Info Notice */}
      <div className="rounded-lg border border-muted bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Accepted formats:</strong> PDF, JPEG, PNG
          <br />
          <strong>Maximum size:</strong> 5 MB per file
        </p>
      </div>

      <div className="space-y-8">
        {/* Authorization Document - Required */}
        <Controller
          control={form.control}
          name="authorization_document"
          render={({ field, fieldState }) => (
            <FileUpload
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              label="Authorization Document"
              description="Official document authorizing account creation (decree, decision, official letter...)"
              required={true}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Justification Document - Optional */}
        <Controller
          control={form.control}
          name="justification_document"
          render={({ field, fieldState }) => (
            <FileUpload
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              label="Additional Supporting Document"
              description="Any additional document that can support your request"
              required={false}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>
    </div>
  );
}
