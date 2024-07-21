import { IconAlien, IconAnchor, IconAward, IconBat, IconBone, IconBottle, IconBow, IconBuildings, IconBurger } from '@tabler/icons-react'

export const Icon = ({ type = 'award', className }: { type?: string; className?: string }) => {
  const icons = {
    award: <IconAward className={className} />,
    alien: <IconAlien className={className} />,
    anchor: <IconAnchor className={className} />,
    bat: <IconBat className={className} />,
    bottle: <IconBottle className={className} />,
    bone: <IconBone className={className} />,
    bow: <IconBow className={className} />,
    buildings: <IconBuildings className={className} />,
    burger: <IconBurger className={className} />,
    default: <IconAlien className={className} />
  }

  return icons[type as keyof typeof icons] || icons.default
}
