/* eslint-disable camelcase */
import { NotificationType as NotificationType_Original } from '@prisma/client'

export const NotificationType: { [k in NotificationType_Original]: k } = {
  GROUP_INVITE: 'GROUP_INVITE',
  GENERIC: 'GENERIC'
} as const

// eslint-disable-next-line no-redeclare
export type NotificationType = NotificationType_Original
