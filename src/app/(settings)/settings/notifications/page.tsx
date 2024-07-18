import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Dashboard'
}

export default function Notifications () {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones deseadas</CardTitle>
          <CardDescription>
            Elije las notificaciones que deseas recibir, desde invitaciones a grupos hasta actualizaciones de gastos y pagos de deudas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="items-top flex space-x-2">
              <Checkbox id="invitations" />
              <Label htmlFor="invitations">Invitaciones a grupos</Label>
            </div>

            <div className="items-top flex space-x-2">
              <Checkbox id="expenses" />
              <Label htmlFor="expenses">Gastos agregados</Label>
            </div>

            <div className="items-top flex space-x-2">
              <Checkbox id="payments" />
              <Label htmlFor="payments">Pagos de deudas</Label>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-end">
          <Button>Guardar</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alertas ante gastos excesivos</CardTitle>
          <CardDescription>
            Recibe notificaciones cuando tus gastos superen un límite establecido, ayudándote a mantener un control de tus finanzas y evitar gastos innecesarios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <Input placeholder="$1400000" type="number" min="0" max={Number.MAX_SAFE_INTEGER} />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-end">
          <Button>Guardar</Button>
        </CardFooter>
      </Card>
    </>
  )
}
