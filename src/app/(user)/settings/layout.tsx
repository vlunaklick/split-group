import { SettingsNav } from '../nav'

export default async function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="grid gap-1">
        <h1 className="text-display-sm">Configuración</h1>
        <p className="text-sm text-muted-foreground">Tu cuenta, avisos y apariencia.</p>
      </header>
      <div className="grid items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr]">
        <SettingsNav />
        <div className="grid gap-6">{children}</div>
      </div>
    </>
  )
}
