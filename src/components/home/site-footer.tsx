import { siteConfig } from '@/config/site'
import { Logo } from '../logo'

export const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container px-4 py-16 md:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Logo />
          <p className="text-sm text-muted-foreground">
            {siteConfig.name} — divide gastos con amigos y familia.
          </p>
        </div>
      </div>
    </footer>
  )
}
