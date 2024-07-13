import type { ROLE as ROLE_ORIGINAL } from '@prisma/client'

export const ROLE: { [k in ROLE_ORIGINAL]: k } = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const

// eslint-disable-next-line no-redeclare
export type ROLE = ROLE_ORIGINAL
