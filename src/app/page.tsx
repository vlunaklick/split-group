import { Announcement } from '@/components/home/announcement'
import { FaqPage } from '@/components/home/faq'
import { SiteFooter } from '@/components/home/site-footer'
import { SiteHeader } from '@/components/home/site-header'
import { TrustedBy } from '@/components/home/trusted-by'
import { BorderBeam } from '@/components/magicui/border-beam'
import WordRotate from '@/components/magicui/word-rotate'
import Image from 'next/image'

export default function Home () {
  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-dot-black/[0.2] dark:bg-dot-white/[0.2] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" aria-hidden="true" />

      <SiteHeader />

      <main className="flex-grow z-10">
        <section className="container mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
          <Announcement />
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter bg-gradient-to-br from-black from-50% to-neutral-200/60 dark:from-white dark:to-neutral-400/60 bg-clip-text text-transparent max-w-[43.5rem]">
            Organiza tus gastos de forma <WordRotate words={['inteligente', 'eficiente', 'sencilla']} />
          </h1>
          <p className="max-w-xl text-base md:text-lg text-muted-foreground">
            Con nuestra aplicación podrás llevar un control de tus gastos de forma sencilla y eficiente. ¡Empieza a organizar tus gastos hoy!
          </p>

          <TrustedBy />

          <div className="relative rounded-xl overflow-hidden border border-transparent max-w-[1000px] w-full">
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
            <BorderBeam size={250} duration={12} delay={9} colorFrom="#3b82f6" colorTo="#581c87" anchor={4} />
          </div>

          <FaqPage />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
