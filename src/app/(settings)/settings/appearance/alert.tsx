import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export const AlertSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tamaño de alertas</CardTitle>
        <CardDescription>
          Personaliza el tamaño de las alertas que se muestran en la aplicación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tamaño" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="advanced">Avanzado</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Button>Guardar</Button>
      </CardFooter>
    </Card>
  )
}
