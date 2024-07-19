import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export const NotificationsWantedSettings = ({ userId }: { userId: string }) => {
  return (
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
  )
}
