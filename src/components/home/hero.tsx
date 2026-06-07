import { ProductPreview } from '@/components/home/product-preview'
import { TrustedBy } from '@/components/home/trusted-by'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calculator } from 'lucide-react'
import Link from 'next/link'

const useCases = ['Viajes', 'Pisos compartidos', 'Cenas en grupo', 'Eventos']

export function Hero () {
  return (
    <section className="container mx-auto px-4 py-8 md:py-10 lg:py-12">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10 xl:gap-14">
        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Gratis · Sin límites
          </p>

          <h1 className="max-w-xl text-[1.75rem] leading-[1.15] tracking-tight sm:text-[2.25rem] lg:text-[2.75rem]">
            Divide gastos con amigos,{' '}
            <span className="text-primary">sin complicaciones</span>
          </h1>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-[17px]">
            Registra quién pagó qué, invita al grupo con un enlace y deja que la app
            calcule quién debe a quién. Olvídate de hojas de cálculo y mensajes interminables.
          </p>

          <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
            {useCases.map((label) => (
              <span
                key={label}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button variant="download" size="lg" asChild>
              <Link href="/register">
                Crear grupo gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/calculator">
                <Calculator className="mr-2 h-4 w-4" />
                Probar calculadora
              </Link>
            </Button>
          </div>

          <TrustedBy />
        </div>

        <div className="relative mx-auto w-full max-w-[640px] lg:max-w-none">
          <div className="pointer-events-none absolute -inset-4 rounded-2xl bg-primary/5 blur-2xl" />
          <ProductPreview />
        </div>
      </div>
    </section>
  )
}
