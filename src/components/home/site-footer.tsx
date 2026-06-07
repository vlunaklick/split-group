import { siteConfig } from '@/config/site'
import { Logo } from '../logo'

export const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container flex flex-col items-start justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center md:px-6">
        <Logo />
        <p className="text-sm text-muted-foreground">
          {siteConfig.name} — divide gastos con amigos y familia.
        </p>
      </div>
    </footer>
  )
}
