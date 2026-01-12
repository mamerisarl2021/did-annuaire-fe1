"use client";

import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ActivateSuccessStepProps {
  /** Handler for login button click */
  onLoginClick: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Pure UI component for activation success state
 *
 * Responsibilities:
 * - Displays success message
 * - Provides login button
 */
export function ActivateSuccessStep({ onLoginClick, className }: ActivateSuccessStepProps) {
  return (
    <div className={cn("text-center space-y-4", className)}>
      <div className="mx-auto bg-green-100 p-3 rounded-full w-fit">
        <CheckCircle className="size-8 text-green-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-green-600">Account Activated!</h3>
        <p className="text-muted-foreground">Your account is ready. You can now log in.</p>
      </div>
      <Button onClick={onLoginClick} className="mt-4">
        Login Now
      </Button>
    </div>
  );
}
