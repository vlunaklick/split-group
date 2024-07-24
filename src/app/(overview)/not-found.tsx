import { buttonVariants } from '@/components/ui/button'
import { IconMoodConfuzedFilled } from '@tabler/icons-react'
import Link from 'next/link'

export default function NotFound () {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <IconMoodConfuzedFilled className="w-10 dark:text-gray-400 text-black" />
      <h2 className="text-xl font-semibold">No encontrado</h2>
      <p>¡Ups! Parece que la página que buscas no existe.</p>
      <Link
        href="/dashboard"
        className={buttonVariants({ variant: 'outline' })}
      >
        Volver al inicio
      </Link>
    </div>
  )
}
