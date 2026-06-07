'use client'

import { sendWeeklyDigestToCurrentUser } from '@/app/(user)/settings/digest-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { displayToast } from '@/utils/toast-display'
import { Mail } from 'lucide-react'
import { useState } from 'react'

export function WeeklyDigestSetting () {
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    setIsLoading(true)
    try {
      await sendWeeklyDigestToCurrentUser()
      displayToast('Resumen enviado a tu email', 'success')
    } catch (error) {
      displayToast(error instanceof Error ? error.message : 'No se pudo enviar', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Resumen semanal
        </CardTitle>
        <CardDescription>
          Balance, deudas pendientes y gastos de la semana. Por ahora podés enviártelo manualmente; pronto automático.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Incluye cuánto debés, cuánto te deben, movimientos recientes y lo pendiente por grupo.
        </p>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button type="button" onClick={handleSend} disabled={isLoading}>
          {isLoading ? 'Enviando…' : 'Enviarme resumen ahora'}
        </Button>
      </CardFooter>
    </Card>
  )
}
