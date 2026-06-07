import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function CtaBanner () {
  return (
    <section className="border-t border-border bg-canvas-soft/60">
      <div className="container mx-auto flex flex-col items-center gap-5 px-4 py-10 text-center md:py-12">
        <h2 className="max-w-md text-display-sm md:text-display-md">
          Deja de perseguir a tus amigos por plata
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base">
          Crea tu primer grupo en menos de un minuto. Gratis, sin tarjeta de crédito.
        </p>
        <Button variant="download" size="lg" asChild>
          <Link href="/register">
            Empezar ahora
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
