'use client'

import { LimitSetting } from '@/components/user/settings/limits-setting'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { getAccountOverview } from '@/data/apis/settings'
import { ArrowRight, Bell, Mail, Palette, User, Wallet } from 'lucide-react'
import Link from 'next/link'

type AccountOverview = NonNullable<Awaited<ReturnType<typeof getAccountOverview>>>

const quickLinks = [
  {
    href: '/settings/notifications',
    label: 'Alertas y avisos',
    description: 'Notificaciones, digest semanal y límite de gasto',
    icon: Bell
  },
  {
    href: '/settings/appearance',
    label: 'Apariencia',
    description: 'Moneda, tema y estilo de alertas',
    icon: Palette
  },
  {
    href: '/settings/account',
    label: 'Datos de cuenta',
    description: 'Nombre, usuario y eliminar cuenta',
    icon: User
  },
  {
    href: '/notifications',
    label: 'Bandeja de avisos',
    description: 'Historial de notificaciones in-app',
    icon: Mail
  }
]

function formatLimit (limit: number | undefined) {
  if (!limit || limit <= 0) return 'Desactivado'
  return `$${limit.toLocaleString('es-AR')}`
}

function countActiveNotifications (config: AccountOverview['configuration']) {
  if (!config) return 0
  return [config.inviteNotification, config.spentNotification, config.paymentNotification]
    .filter(Boolean).length
}

export function AccountDashboard ({ overview }: { overview: AccountOverview }) {
  const { user, configuration, groupCount } = overview
  const displayName = user.name || user.username || 'Tu cuenta'

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{displayName}</CardTitle>
          <CardDescription>
            {user.email ?? `@${user.username}`} · {groupCount} {groupCount === 1 ? 'grupo' : 'grupos'}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Límite mensual
            </CardDescription>
            <CardTitle className="text-xl">{formatLimit(configuration?.limit)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Resumen semanal
            </CardDescription>
            <CardTitle className="text-xl">
              {configuration?.weeklyDigestEmail ? 'Activo' : 'Inactivo'}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Avisos activos
            </CardDescription>
            <CardTitle className="text-xl">{countActiveNotifications(configuration)}/3</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Grupos</CardDescription>
            <CardTitle className="text-xl">{groupCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map(({ href, label, description, icon: Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-colors hover:border-primary/40 hover:bg-muted/30">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
                </div>
                <CardTitle className="text-base">{label}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <LimitSetting />
    </div>
  )
}
