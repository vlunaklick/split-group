import { ThemeSwitcher } from '@/components/theme-switcher'
import Image from 'next/image'

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <section className="flex items-center justify-center bg-background px-6 py-12">
        {children}
      </section>

      <section className="relative hidden bg-canvas-soft lg:block">
        <Image
          src="/login.avif"
          alt="Ilustración de inicio de sesión"
          width="1920"
          height="1080"
          className="h-full w-full object-cover opacity-90"
        />
        <ThemeSwitcher className="absolute right-4 top-4" />
      </section>
    </main>
  )
}
