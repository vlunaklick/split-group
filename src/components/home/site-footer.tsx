import Link from 'next/link'
import { Logo } from '../logo'

export const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div className="flex flex-col gap-1">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Divide gastos con amigos y familia.
          </p>
        </div>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/calculator"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Calculadora
          </Link>
          <Link
            href="/register"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Crear cuenta
          </Link>
          <Link
            href="/login"
            className="font-medium text-foreground transition-colors hover:text-primary"
          >
            Iniciar sesión
          </Link>
        </nav>
      </div>
    </footer>
  )
}
