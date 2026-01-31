"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserCreateModalProps } from "@/lib/features/users/types/users.types";
import { useUserCreateForm } from "@/lib/features/users/hooks/useUserCreateForm";
import { UserCreateFormData } from "@/lib/validations/user.schema";
import { FunctionsInput } from "@/components/FunctionsInput";

export function UserCreateModal({ isOpen, onClose, onConfirm }: UserCreateModalProps) {
  const { form, isLoading, functions, handleFunctionsChange, handleSubmit, resetForm } =
    useUserCreateForm({
      onSuccess: onClose,
    });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onSubmit = (data: UserCreateFormData) => {
    handleSubmit(data, onConfirm);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Team Member</DialogTitle>
          <DialogDescription className="text-gray-600">
            Add a new user account. The user will be created in PENDING state.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        {...field}
                        disabled={isLoading}
                        aria-required="true"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        {...field}
                        disabled={isLoading}
                        aria-required="true"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email Address <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@company.com"
                      {...field}
                      disabled={isLoading}
                      aria-required="true"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      disabled={isLoading}
                      aria-required="true"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="functions"
              render={() => (
                <FunctionsInput
                  value=""
                  functions={functions}
                  onFunctionsChange={handleFunctionsChange}
                  disabled={isLoading}
                />
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="is_auditor"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 p-4 border rounded-lg">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                        aria-label="Auditor role"
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="font-medium cursor-pointer">Auditor Role</FormLabel>
                      <p className="text-sm text-gray-500">
                        User will have auditor permissions and access
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="can_publish_prod"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 p-4 border rounded-lg">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                        aria-label="Production publishing permission"
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="font-medium cursor-pointer">
                        Production Publishing
                      </FormLabel>
                      <p className="text-sm text-gray-500">
                        User can publish to production environment
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
