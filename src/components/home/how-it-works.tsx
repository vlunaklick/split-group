import { Link2, Receipt, Wallet } from 'lucide-react'

const steps = [
  {
    icon: Link2,
    step: '01',
    title: 'Crea tu grupo',
    description: 'Ponle nombre, elige un icono y comparte el enlace de invitación con quien quieras.'
  },
  {
    icon: Receipt,
    step: '02',
    title: 'Registra los gastos',
    description: 'Anota quién pagó, el monto y reparte de forma igualitaria o con montos personalizados.'
  },
  {
    icon: Wallet,
    step: '03',
    title: 'Cierra cuentas',
    description: 'La app calcula los balances, minimiza transferencias y marca deudas como pagadas.'
  }
]

export function HowItWorks () {
  return (
    <section className="border-y border-border bg-canvas-soft/60">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
            Cómo funciona
          </p>
          <h2 className="text-display-sm md:text-display-md">
            Tres pasos y listo
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map(({ icon: Icon, step, title, description }) => (
            <article key={step} className="relative flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{step}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
