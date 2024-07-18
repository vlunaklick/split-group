import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'General',
  description: 'Dashboard'
}

export default function General () {
  return (
    <>
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

      <Card>
        <CardHeader>
          <CardTitle>Nombre de usuario</CardTitle>
          <CardDescription>
            Nombre que se utilizará para acceder a la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder="@johndoe" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-end">
          <Button>Guardar</Button>
        </CardFooter>
      </Card>

      <Card className='border-red-500 dark:border-red-950'>
        <CardHeader>
          <CardTitle>Desactivar cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Una vez desactivada, tu cuenta no podrá ser utilizada para acceder a la plataforma.
          </p>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-end bg-red-800/20 rounded-b-md dark:border-red-950">
          <Button variant='destructive'>Desactivar</Button>
        </CardFooter>
      </Card>
    </>
  )
}
