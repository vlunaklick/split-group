'use client'

import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

export const SignOutButton = ({ className }: { className?: string }) => {
  const handleLogout = async () => {
    await signOut()
  }

  return (
    <button onClick={handleLogout} className={cn('block w-full text-left', className)}>
      Cerrar sesión
    </button>
  )
}
