'use client'

import { payAllDebt } from '@/app/(overview)/groups/[groupId]/actions'
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { formatMoney } from '@/lib/money'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import { z } from 'zod'

const schema = z.object({
  note: z.string().max(200, 'Máximo 200 caracteres').optional()
})

export function PayDebtDialog ({
  groupId,
  crediterId,
  crediterName,
  amount
}: {
  groupId: string
  crediterId: string
  crediterName: string
  amount: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { note: '' }
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true)
    try {
      await payAllDebt({
        groupId,
        crediterId,
        note: values.note?.trim() || undefined
      })
      displayToast('Marcado como pagado', 'success')
      mutate(['debts', groupId])
      mutate(['group-settlement', groupId])
      setIsOpen(false)
      form.reset()
    } catch (error) {
      displayToast('No se pudo marcar como pagado', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs"
        onClick={() => setIsOpen(true)}
      >
        Pagado
      </Button>

      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Marcar como pagado"
        description={`Le debés ${formatMoney(Math.abs(amount))} a ${crediterName}. Podés dejar una nota opcional.`}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>Nota (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Transferí por Mercado Pago, alias juan.perez"
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Guardando…' : 'Confirmar pago'}
            </Button>
          </form>
        </Form>
      </ResponsiveDialog>
    </>
  )
}
