import { CtaBanner } from '@/components/home/cta-banner'
import { EasterEgg } from '@/components/home/easter-egg'
import { Faq } from '@/components/home/faq'
import { Features } from '@/components/home/features'
import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { ProductShowcase } from '@/components/home/product-showcase'
import { SiteFooter } from '@/components/home/site-footer'
import { SiteHeader } from '@/components/home/site-header'

export default function Home () {
  return (
    <div className="flex flex-col bg-background">
      <SiteHeader />

      <main>
        <Hero />
        <ProductShowcase />
        <HowItWorks />
        <Features />
        <Faq />
        <CtaBanner />
      </main>

      <SiteFooter />

      <EasterEgg />
    </div>
  )
}
