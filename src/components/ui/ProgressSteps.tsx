interface Step {
  label: string
  description: string
  status: 'done' | 'active' | 'pending'
}

interface ProgressStepsProps {
  steps: Step[]
}

const circleStyles = {
  done:    'bg-accent-mid text-white',
  active:  'bg-accent text-white',
  pending: 'bg-surface-3 text-ink-3 border border-border-m',
}

export function ProgressSteps({ steps }: ProgressStepsProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${circleStyles[step.status]}`}
              style={{ width: 26, height: 26 }}
            >
              {step.status === 'done' ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="w-[2px] flex-1 min-h-[24px] bg-border-m" />
            )}
          </div>
          <div className="pb-5">
            <p className={`text-sm font-semibold ${step.status === 'pending' ? 'text-ink-3' : 'text-ink'}`}>
              {step.label}
            </p>
            <p className="text-xs text-ink-3 mt-0.5">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
