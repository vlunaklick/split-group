'use client'

import { signOut } from 'next-auth/react'

export const SignOutButton = () => {
  const handleLogout = async () => {
    await signOut()
  }

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  )
}
