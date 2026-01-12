import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RegistrationStep } from "@/lib/types/organization-status";

interface RegistrationStepperProps {
  steps: RegistrationStep[];
  className?: string;
}

/**
 * Registration Progress Stepper
 * Displays the registration process steps with status
 */
export function RegistrationStepper({ steps, className }: RegistrationStepperProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative flex gap-4">
            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  "absolute left-4 top-10 h-[calc(100%-8px)] w-0.5 -translate-x-1/2",
                  step.status === "completed" ? "bg-primary" : "bg-muted"
                )}
              />
            )}

            {/* Step circle */}
            <div
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                step.status === "completed" && "border-primary bg-primary text-primary-foreground",
                step.status === "current" && "border-primary bg-background text-primary",
                step.status === "upcoming" &&
                  "border-muted-foreground/30 bg-background text-muted-foreground"
              )}
            >
              {step.status === "completed" ? (
                <Check className="size-4" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>

            {/* Step content */}
            <div className="flex-1 pb-6">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.status === "current" ? "text-primary" : "text-foreground"
                )}
              >
                {step.title}
              </p>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
