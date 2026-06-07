import { SettingsNav } from '../nav'
import Link from 'next/link'

export default async function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="mx-auto grid w-full max-w-6xl gap-2">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-display-sm">Configuración</h1>
          <Link href="/dashboard" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Volver al panel
          </Link>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <SettingsNav />

        <div className="grid gap-6">
          {children}
        </div>
      </div>
    </>
  )
}
