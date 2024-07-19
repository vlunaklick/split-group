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
import { DeleteSetting } from './delete'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'General',
  description: 'Dashboard'
}

export default async function General () {
  const session = await getServerSession(authOptions)

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

      <DeleteSetting userId={session?.user?.id as string} />
    </>
  )
}
