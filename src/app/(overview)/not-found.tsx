import { Button } from '@/components/ui/button'
import { IconMoodConfuzedFilled } from '@tabler/icons-react'
import Link from 'next/link'

export default function NotFound () {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
      <IconMoodConfuzedFilled className="h-24 w-24 text-muted-foreground" aria-hidden="true" />
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404: No encontrado</h1>
        <p className="text-xl text-muted-foreground">
          ¡Ups! Parece que la página que buscas no existe.
        </p>
      </div>

      <Button variant="default" size="lg" asChild>
        <Link href="/dashboard">
          Volver al inicio
        </Link>
      </Button>
    </div>
  )
}
