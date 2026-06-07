import { Announcement } from '@/components/home/announcement'
import { EasterEgg } from '@/components/home/easter-egg'
import { FaqPage } from '@/components/home/faq'
import { SiteFooter } from '@/components/home/site-footer'
import { SiteHeader } from '@/components/home/site-header'
import { TrustedBy } from '@/components/home/trusted-by'
import { Button } from '@/components/ui/button'
import { FlipWords } from '@/components/ui/flip-words'
import Image from 'next/image'
import Link from 'next/link'

export default function Home () {
  const words = ['inteligente', 'eficiente', 'sencilla']

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-grow">
        <section className="container mx-auto flex flex-col items-center gap-8 px-4 py-section text-center">
          <Announcement />

          <div className="flex max-w-3xl flex-col items-center gap-6">
            <h1 className="text-display-mega max-w-[43.5rem] sm:text-[2rem] md:text-[3.5rem] lg:text-display-mega">
              Gestiona tus finanzas de manera{' '}
              <FlipWords words={words} className="text-primary" />
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Con nuestra aplicación podrás llevar un control de tus gastos de forma sencilla y eficiente. Empieza a organizar tus gastos hoy.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button variant="download" size="lg" asChild>
                <Link href="/register">Comenzar gratis</Link>
              </Button>
              <Button variant="link" asChild>
                <Link href="/calculator">Probar calculadora</Link>
              </Button>
            </div>
          </div>

          <TrustedBy />

          <div className="w-full max-w-[1000px] overflow-hidden rounded-lg border border-border bg-card">
            <Image
              src="/dashboard-dark.png"
              alt="Vista previa del dashboard en modo oscuro"
              width={1000}
              height={562}
              className="hidden dark:block"
            />
            <Image
              src="/dashboard-light.png"
              alt="Vista previa del dashboard en modo claro"
              width={1000}
              height={562}
              className="block dark:hidden"
            />
          </div>

          <FaqPage />
        </section>
      </main>

      <SiteFooter />

      <EasterEgg />
    </div>
  )
}
