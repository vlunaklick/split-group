import { buttonVariants } from '@/components/ui/button'
import { IconMoodConfuzedFilled } from '@tabler/icons-react'
import Link from 'next/link'

export default function NotFound () {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <IconMoodConfuzedFilled className="w-10 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Página no encontrada</h2>
      <p>¡Ups! Parece que la página que buscas no existe.</p>
      <Link
        href="/settings"
        className={buttonVariants({ variant: 'outline' })}
      >
        Volver a ajustes
      </Link>
    </main>
  )
}
