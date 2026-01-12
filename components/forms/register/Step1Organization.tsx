"use client";

import * as React from "react";
import { type UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AllowedEmailDomainsInput } from "./AllowedEmailDomainsInput";
import { ORGANIZATION_TYPES } from "@/lib/schemas/register.step1.schema";
import type { RegisterFormData } from "@/lib/schemas/register.schema";
import { useCountries } from "@/lib/features/countries/hooks/useCountries";
import { usePhonePrefixSync } from "@/lib/features/countries/hooks/usePhonePrefixSync";
import { CountrySelect } from "@/components/common/CountrySelect";

interface Step1OrganizationProps {
  form: UseFormReturn<RegisterFormData>;
  className?: string;
}

/**
 * Step 1: Organization Information Form
 * Pure UI component - receives form from parent
 */
export function Step1Organization({ form, className }: Step1OrganizationProps) {
  const { countries, loading, error } = useCountries();
  const { syncPhonePrefix } = usePhonePrefixSync({ form, countries });

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Organization Information</h2>
        <p className="text-sm text-muted-foreground">
          Enter general information about your organization.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Organization Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Ministry of Health" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Two columns for org type and country */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Organization Type */}
          <FormField
            control={form.control}
            name="org_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ORGANIZATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Country *</FormLabel>
                <FormControl>
                  <CountrySelect
                    countries={countries}
                    value={field.value}
                    onChange={(country) => {
                      const oldCountryCode = field.value;
                      field.onChange(country.code);
                      syncPhonePrefix(country, oldCountryCode);
                    }}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contact@organisation.com" {...field} />
              </FormControl>
              <FormDescription>
                This email will be used for official communications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone *</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+229 XX XX XX XX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Address *</FormLabel>
              <FormControl>
                <Textarea placeholder="Ex: 01 BP 1234, Cotonou, Bénin" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Allowed Email Domains */}
        <AllowedEmailDomainsInput form={form} />
      </div>
    </div>
  );
}
