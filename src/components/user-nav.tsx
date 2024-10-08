import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { SignOutButton } from './sign-out-button'

export const UserNav = async ({ className }: { className?: string }) => {
  const session = await getServerSession(authOptions)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className={cn('rounded-full', className)}>
          <span>
            {session?.user?.name[0].toUpperCase()}
          </span>
          <span className="sr-only">Alternar menú de usuario</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {session?.user?.name}
          <span className="text-muted-foreground block text-xs">
            {session?.user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href={`/user/${session?.user?.username}`}>
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href="/settings">
            Configuración
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton className="w-full text-left" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const UserNavSkeleton = () => {
  return (
    <Button variant="secondary" size="icon" className="rounded-full ml-auto animate-pulse">
      <span className="sr-only">Alternar menú de usuario</span>
    </Button>
  )
}
