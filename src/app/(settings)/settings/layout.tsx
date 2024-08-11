import { SettingsNav } from '../nav'

export default async function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Configuración</h1>
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
