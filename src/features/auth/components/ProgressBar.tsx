/**
 * Barre de progression d'inscription
 * =================================
 *
 * Affiche la progression des étapes d'inscription.
 */

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { number: 1, label: 'Organisation' },
  { number: 2, label: 'Administrateur' },
  { number: 3, label: 'Justificatif' },
];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    step.number <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {step.number}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium
                  ${
                    step.number <= currentStep
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }
                `}
              >
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-4
                  ${
                    step.number < currentStep
                      ? 'bg-primary'
                      : 'bg-muted'
                  }
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}