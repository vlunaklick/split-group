import { LandingScreenshot } from '@/components/home/landing-screenshot'

const shots = [
  {
    name: 'dashboard',
    title: 'Inicio',
    alt: 'Dashboard de Split Group con balance, grupos y gastos recientes',
    caption: 'Tu panel con balance neto, grupos y pendientes'
  },
  {
    name: 'group-home',
    title: 'Grupo',
    alt: 'Resumen de un grupo con estado de liquidación y actividad reciente',
    caption: 'Estado del grupo, balance y actividad'
  },
  {
    name: 'spendings',
    title: 'Gastos',
    alt: 'Lista de gastos y recurrentes en Split Group',
    caption: 'Gastos, recurrentes e historial del grupo'
  }
]

export function ProductShowcase () {
  return (
    <section
      id="app-en-accion"
      className="scroll-mt-20 border-y border-border bg-canvas-soft/60"
    >
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
            La app en acción
          </p>
          <h2 className="text-display-sm md:text-display-md">
            Capturas reales del producto
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
            Sin mockups genéricos — así se ve Split Group cuando la usás de verdad.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {shots.map((shot) => (
            <LandingScreenshot key={shot.name} {...shot} />
          ))}
        </div>
      </div>
    </section>
  )
}
