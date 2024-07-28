import { IconCheese, IconFirstAidKit, IconBackpack, IconMap2, IconCube } from '@tabler/icons-react'

export const SpendingIcon = ({ type, className }: { className?: string, type: 'Comida' | 'Transporte' | 'Entretenimiento' | 'Salud' | 'Educación' | 'Otros' }) => {
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
