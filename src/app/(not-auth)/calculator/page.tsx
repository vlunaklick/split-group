import { AddParticipants } from '@/components/calculator/add-participants'
import { SiteFooter } from '@/components/home/site-footer'
import { SiteHeader } from '@/components/home/site-header'

export default function Home () {
  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-dot-black/[0.2] dark:bg-dot-white/[0.2] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" aria-hidden="true" />

      <SiteHeader />

      <main className="flex-grow z-10">
        <AddParticipants />
      </main>

      <SiteFooter />
    </div>
  )
}
