import { StepItem } from '@/components/ui/stepper'
import { IconCoin, IconUser, IconUsers } from '@tabler/icons-react'

export const SPENDING_STEPS = [
  { label: 'Detalles', description: 'Nombre, monto y categoría', icon: IconUser },
  { label: 'Quién pagó', description: 'Quién puso el dinero y cuánto', icon: IconCoin },
  { label: 'Quién debe', description: 'Cómo se reparte entre los participantes', icon: IconUsers }
] as StepItem[]
