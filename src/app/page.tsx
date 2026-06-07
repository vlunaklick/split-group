import { EasterEgg } from '@/components/home/easter-egg'
import { Hero } from '@/components/home/hero'
import { SiteFooter } from '@/components/home/site-footer'
import { SiteHeader } from '@/components/home/site-header'
import { ValueProps } from '@/components/home/value-props'

export default function Home () {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <Hero />
        <ValueProps />
      </main>

      <SiteFooter />

      <EasterEgg />
    </div>
  )
}
