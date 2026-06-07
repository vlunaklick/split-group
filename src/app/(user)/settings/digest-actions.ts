'use server'

import { WeeklyDigestEmail } from '@/components/mails/weekly-digest'
import { getWeeklyDigestData } from '@/data/apis/digest'
import { requireSession } from '@/lib/server-auth'
import { db } from '@/lib/db'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWeeklyDigestToCurrentUser () {
  const { userId } = await requireSession()
  const digest = await getWeeklyDigestData(userId)

  if (!digest) {
    throw new Error('Necesitás un email en tu cuenta para recibir el resumen')
  }

  const { error } = await resend.emails.send({
    from: 'SplitGroup <splitgroup@vmoon.me>',
    to: digest.email,
    subject: `Tu semana en Split Group · ${digest.netBalance >= 0 ? '+' : ''}${digest.netBalance.toFixed(2)}`,
    react: WeeklyDigestEmail(digest)
  })

  if (error) {
    console.error(error)
    throw new Error('No se pudo enviar el email')
  }

  return { sent: true }
}

export async function sendWeeklyDigestToAllUsers () {
  const users = await db.user.findMany({
    where: {
      email: { not: null },
      userConfig: { weeklyDigestEmail: true }
    },
    select: { id: true }
  })

  let sent = 0
  let failed = 0
  let skipped = 0

  for (const user of users) {
    try {
      const digest = await getWeeklyDigestData(user.id)
      if (!digest) {
        skipped++
        continue
      }

      const { error } = await resend.emails.send({
        from: 'SplitGroup <splitgroup@vmoon.me>',
        to: digest.email,
        subject: `Tu semana en Split Group · ${digest.netBalance >= 0 ? '+' : ''}${digest.netBalance.toFixed(2)}`,
        react: WeeklyDigestEmail(digest)
      })

      if (error) {
        failed++
        console.error(error)
      } else {
        sent++
      }
    } catch (error) {
      failed++
      console.error(error)
    }
  }

  return { sent, failed, skipped, total: users.length }
}

export async function updateWeeklyDigestEmail ({ enabled }: { enabled: boolean }) {
  const { userId } = await requireSession()

  await db.userConfig.update({
    where: { userId },
    data: { weeklyDigestEmail: enabled }
  })

  return true
}
