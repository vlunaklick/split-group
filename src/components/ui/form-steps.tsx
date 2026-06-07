'use client'

import { cn } from '@/lib/utils'
import { createContext, useContext, useMemo, useState } from 'react'

type FormStepsContextValue = {
  activeStep: number
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void
  stepCount: number
}

const FormStepsContext = createContext<FormStepsContextValue | null>(null)

export function FormStepsProvider ({
  steps,
  children,
  initialStep = 0
}: {
  steps: string[]
  children: React.ReactNode
  initialStep?: number
}) {
  const [activeStep, setActiveStep] = useState(initialStep)

  const value = useMemo<FormStepsContextValue>(() => ({
    activeStep,
    nextStep: () => setActiveStep((s) => Math.min(s + 1, steps.length - 1)),
    prevStep: () => setActiveStep((s) => Math.max(s - 1, 0)),
    setStep: setActiveStep,
    stepCount: steps.length
  }), [activeStep, steps.length])

  return (
    <FormStepsContext.Provider value={value}>
      <FormStepProgress steps={steps} currentStep={activeStep} />
      {children}
    </FormStepsContext.Provider>
  )
}

export function useFormSteps () {
  const context = useContext(FormStepsContext)
  if (!context) {
    throw new Error('useFormSteps must be used within FormStepsProvider')
  }
  return context
}

export function FormStep ({ index, children }: { index: number, children: React.ReactNode }) {
  const { activeStep } = useFormSteps()

  return (
    <div className={cn('grid gap-5', activeStep !== index && 'hidden')} aria-hidden={activeStep !== index}>
      {children}
    </div>
  )
}

export function FormStepProgress ({ steps, currentStep }: { steps: string[], currentStep: number }) {
  return (
    <div className="mb-5 grid gap-2.5 rounded-lg border border-border bg-muted/30 px-4 py-3">
      <div className="flex gap-1.5">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              index <= currentStep ? 'bg-primary' : 'bg-border'
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Paso {currentStep + 1} de {steps.length}
        <span className="font-medium text-foreground"> · {steps[currentStep]}</span>
      </p>
    </div>
  )
}

export function SheetSection ({
  title,
  description,
  children,
  className
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('grid gap-3 border-t border-border pt-5', className)}>
      <div className="grid gap-1">
        <h3 className="section-label">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}
