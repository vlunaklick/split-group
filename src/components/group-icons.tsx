import { IconAlien, IconAward } from '@tabler/icons-react'

export const Icon = ({ type = 'award', className }: { type?: string; className?: string }) => {
  const icons = {
    award: <IconAward className={className} />,
    alien: <IconAlien className={className} />
  }

  return icons[type as keyof typeof icons]
}
