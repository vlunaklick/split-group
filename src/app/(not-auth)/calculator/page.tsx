import { SplitCalculator } from '@/components/calculator/split-calculator'
import { SiteFooter } from '@/components/home/site-footer'
import { SiteHeader } from '@/components/home/site-header'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora de gastos',
  description: 'Calculá quién pagó, cómo se reparte y quién le debe a quién — sin crear cuenta'
}

export default function CalculatorPage () {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-grow">
        <SplitCalculator />
      </main>

      <SiteFooter />
    </div>
  )
}
