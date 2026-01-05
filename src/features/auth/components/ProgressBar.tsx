/**
 * Barre de progression d'inscription
 * =================================
 *
 * Affiche la progression des étapes d'inscription.
 */

interface ProgressBarProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Informations Organisationnelles' },
  { number: 2, label: 'Informations Administratives' },
];

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  step.number <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                } `}
              >
                {step.number}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  step.number <= currentStep ? 'text-primary' : 'text-muted-foreground'
                } `}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-0.5 flex-1 ${
                  step.number < currentStep ? 'bg-primary' : 'bg-muted'
                } `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
