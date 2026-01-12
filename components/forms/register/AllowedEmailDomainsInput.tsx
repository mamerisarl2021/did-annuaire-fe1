"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RegisterFormData } from "@/lib/schemas/register.schema";

interface AllowedEmailDomainsInputProps {
  form: UseFormReturn<RegisterFormData>;
  className?: string;
}

/**
 * Dynamic input for allowed email domains
 * Uses RHF useFieldArray for add/remove functionality
 */
export function AllowedEmailDomainsInput({ form, className }: AllowedEmailDomainsInputProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "allowed_email_domains",
  });

  const errors = form.formState.errors.allowed_email_domains;

  const handleAddDomain = () => {
    append({ value: "" });
  };

  const handleRemoveDomain = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          Domaines email autorisés <span className="text-destructive">*</span>
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddDomain}
          className="gap-1"
        >
          <Plus className="size-4" />
          Ajouter
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Les utilisateurs avec ces domaines email pourront rejoindre votre organisation. Format:
        example.com
      </p>

      {/* Domain list error */}
      {errors?.message && typeof errors.message === "string" && (
        <p className="text-sm text-destructive">{errors.message}</p>
      )}

      <div className="space-y-2">
        {fields.map((field, index) => {
          const fieldError = errors?.[index]?.value;

          return (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <Input
                  {...form.register(`allowed_email_domains.${index}.value`)}
                  placeholder="exemple.com"
                  aria-invalid={!!fieldError}
                  className={cn(fieldError && "border-destructive")}
                />
                {fieldError && (
                  <p className="mt-1 text-sm text-destructive">{fieldError.message}</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveDomain(index)}
                disabled={fields.length === 1}
                className="text-muted-foreground hover:text-destructive shrink-0"
              >
                <X className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
