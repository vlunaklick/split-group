import { AddParticipants } from '@/components/calculator/add-participants'
import { SiteFooter } from '@/components/home/site-footer'
import { SiteHeader } from '@/components/home/site-header'

export default function CalculatorPage () {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-grow">
        <AddParticipants />
      </main>

      <SiteFooter />
    </div>
  )
}
