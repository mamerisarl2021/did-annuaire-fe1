"use client";

import * as React from "react";
import { type UseFormReturn } from "react-hook-form";
import { User, Mail, Phone, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import type { RegisterFormData } from "@/lib/schemas/register.schema";

interface Step2AdminProps {
  form: UseFormReturn<RegisterFormData>;
  className?: string;
}

/**
 * Step 2: Administrator Information Form
 * Pure UI component - receives form from parent
 */
export function Step2Admin({ form, className }: Step2AdminProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Organization Administrator</h2>
        <p className="text-sm text-muted-foreground">
          The main administrator will have full control over the organization. Make sure to use a
          valid and accessible email address.
        </p>
      </div>

      {/* Important Notice */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm text-foreground">
          <strong>Important :</strong> The administrator will receive login credentials and will be
          responsible for managing users and organization settings.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Admin Email */}
        <FormField
          control={form.control}
          name="admin_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administrator Email *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="admin@organization.com"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                This email will be used for login and account recovery.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* First Name and Last Name */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="admin_first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="John" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="admin_last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Admin Phone */}
        <FormField
          control={form.control}
          name="admin_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="tel" placeholder="+229 XX XX XX XX" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Functions */}
        <FormField
          control={form.control}
          name="functions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role in Organization *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Ex: Chief Information Officer" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormDescription>The title or official role of the administrator.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
