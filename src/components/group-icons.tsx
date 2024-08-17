import { IconAlien, IconAnchor, IconAward, IconBat, IconBone, IconBottle, IconBow, IconBuildings, IconBurger } from '@tabler/icons-react'

export const Icon = ({ type = 'award', className }: { type?: string; className?: string }) => {
  const icons = {
    award: IconAward,
    alien: IconAlien,
    anchor: IconAnchor,
    bat: IconBat,
    bottle: IconBottle,
    bone: IconBone,
    bow: IconBow,
    buildings: IconBuildings,
    burger: IconBurger,
    default: IconAlien
  }

  const Icon = icons[type as keyof typeof icons] || icons.default

  return <Icon className={className} />
}

export const GROUP_ICONS = [
  {
    name: 'alien',
    Icon: IconAlien
  },
  {
    name: 'anchor',
    Icon: IconAnchor
  },
  {
    name: 'award',
    Icon: IconAward
  },
  {
    name: 'bat',
    Icon: IconBat
  },
  {
    name: 'bone',
    Icon: IconBone
  },
  {
    name: 'bottle',
    Icon: IconBottle
  },
  {
    name: 'bow',
    Icon: IconBow
  },
  {
    name: 'buildings',
    Icon: IconBuildings
  },
  {
    name: 'burger',
    Icon: IconBurger
  }
]
