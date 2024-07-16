import { buttonVariants } from '@/components/ui/button'
import { IconMoodConfuzedFilled } from '@tabler/icons-react'
import Link from 'next/link'

export default function NotFound () {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <IconMoodConfuzedFilled className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">Página no encontrada</h2>
      <p>¡Ups! No encontramos la página que buscas.</p>
      <Link
        href="/login"
        className={buttonVariants({ variant: 'outline' })}
      >
        Volver al login
      </Link>
    </main>
  )
}
