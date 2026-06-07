import { FileDown, Scale, Users } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Grupos con un enlace',
    description: 'Crea un grupo e invita a amigos, compañeros de piso o familia en segundos.'
  },
  {
    icon: Scale,
    title: 'Balances al instante',
    description: 'La app calcula quién debe a quién y minimiza los pagos entre miembros.'
  },
  {
    icon: FileDown,
    title: 'Exporta y comparte',
    description: 'Descarga los gastos en PDF o Excel cuando necesites cerrar cuentas.'
  }
]

export function ValueProps () {
  return (
    <section className="border-t border-border bg-canvas-soft/50">
      <div className="container mx-auto grid gap-6 px-4 py-8 md:grid-cols-3 md:gap-8 md:py-10">
        {features.map(({ icon: Icon, title, description }) => (
          <article key={title} className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-foreground">{title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
