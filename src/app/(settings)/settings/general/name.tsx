'use client'

import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const NameSettings = ({ userId }: { userId: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nombre de la cuenta</CardTitle>
        <CardDescription>
          Nombre que se mostrará en la plataforma para el resto de usuarios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Input placeholder="John Doe" />
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Button>Guardar</Button>
      </CardFooter>
    </Card>
  )
}
