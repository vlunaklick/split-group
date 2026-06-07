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
      </header>
      <div className="grid items-start gap-8 md:grid-cols-[140px_1fr]">
        <SettingsNav />
        <div className="grid gap-6">{children}</div>
      </div>
    </>
  )
}
