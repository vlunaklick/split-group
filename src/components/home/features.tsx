import {
  ArrowRightLeft,
  Bell,
  RefreshCw,
  Scale,
  Smartphone,
  Users
} from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Grupos con invitación',
    description: 'Crea grupos con nombre e icono. Invita miembros con un enlace — no hace falta que todos se registren al mismo tiempo.'
  },
  {
    icon: Scale,
    title: 'División flexible',
    description: 'Reparte gastos de forma igualitaria o asigna montos específicos por persona. Fecha, categoría y descripción incluidos.'
  },
  {
    icon: ArrowRightLeft,
    title: 'Plan de liquidación',
    description: 'La app calcula quién debe a quién y minimiza las transferencias. Sabés exactamente cuánto pagar y a quién.'
  },
  {
    icon: RefreshCw,
    title: 'Gastos recurrentes',
    description: 'Configurá alquiler, Netflix o servicios del piso una vez y generá el gasto cada mes sin volver a cargarlo.'
  },
  {
    icon: Bell,
    title: 'Recordatorios de deuda',
    description: 'Enviá un recordatorio amable por email sin perseguir a tus amigos por WhatsApp.'
  },
  {
    icon: Smartphone,
    title: 'Instalable en el móvil',
    description: 'Agregala a la pantalla de inicio y usala como app nativa — sin descargar nada de la store.'
  }
]

export function Features () {
  return (
    <section
      id="funcionalidades"
      className="container mx-auto px-4 py-10 md:py-12"
    >
      <div className="mb-8 text-center md:mb-10">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
          Funcionalidades
        </p>
        <h2 className="text-display-sm md:text-display-md">
          Todo lo que necesitas para dividir gastos
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
          Desde un viaje de fin de semana hasta las cuentas del piso — una sola app para llevar el control.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {features.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background">
              <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
