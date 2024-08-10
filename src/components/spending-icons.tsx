import { IconCheese, IconFirstAidKit, IconBackpack, IconMap2, IconCube } from '@tabler/icons-react'

export type SpendingTypes = 'Comida' | 'Transporte' | 'Entretenimiento' | 'Salud' | 'Educación' | 'Otros'

export const SpendingIcon = ({ type, className }: { className?: string, type: SpendingTypes }) => {
  const icons = {
    Comida: IconCheese,
    Transporte: IconMap2,
    Entretenimiento: IconCube,
    Salud: IconFirstAidKit,
    Educación: IconBackpack,
    Otros: IconCube
  }

  const Icon = icons[type]

  return <Icon className={className} />
}
