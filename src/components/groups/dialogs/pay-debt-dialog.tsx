'use client'

import { payAllDebt } from '@/app/(overview)/groups/[groupId]/actions'
import { payDebt } from '@/app/(overview)/groups/[groupId]/spendings/actions'
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { uploadPaymentReceipt } from '@/lib/upload-payment-receipt'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { Paperclip, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import { z } from 'zod'

const schema = z.object({
  note: z.string().max(200, 'Máximo 200 caracteres').optional(),
  receiptLink: z.string().trim().optional().refine(
    (value) => !value || z.string().url().safeParse(value).success,
    { message: 'Link inválido' }
  )
})

type PayDebtDialogProps = {
  groupId: string
  crediterName: string
  amount: number
  crediterId?: string
  debtId?: string
  spendId?: string
  triggerVariant?: 'ghost' | 'outline'
  triggerClassName?: string
}

export function PayDebtDialog ({
  groupId,
  crediterId,
  crediterName,
  amount,
  debtId,
  spendId,
  triggerVariant = 'ghost',
  triggerClassName
}: PayDebtDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutate } = useSWRConfig()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { note: '', receiptLink: '' }
  })

  const resetForm = () => {
    form.reset()
    setReceiptFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const refreshCaches = () => {
    mutate(['debts', groupId])
    mutate(['group-settlement', groupId])
    mutate(['group-settlement-history', groupId])

    if (spendId) {
      mutate(['current-debts', groupId, spendId])
      mutate(['debts', groupId, spendId])
    }

    mutate('user-onboarding')
    mutate(['group-onboarding', groupId])
  }

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true)
    try {
      let receiptUrl = values.receiptLink?.trim() || undefined

      if (receiptFile) {
        receiptUrl = await uploadPaymentReceipt(receiptFile)
      }

      const note = values.note?.trim() || undefined

      if (debtId) {
        await payDebt({ debtId, note, receiptUrl })
      } else if (crediterId) {
        await payAllDebt({ groupId, crediterId, note, receiptUrl })
      } else {
        throw new Error('No se pudo identificar la deuda')
      }

      displayToast('Marcado como pagado', 'success')
      refreshCaches()
      setIsOpen(false)
      resetForm()
    } catch (error) {
      displayToast(error instanceof Error ? error.message : 'No se pudo marcar como pagado', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) resetForm()
  }

  return (
    <>
      <Button
        variant={triggerVariant}
        size="sm"
        className={cn(
          triggerVariant === 'ghost' && 'h-8 px-2 text-xs',
          triggerClassName
        )}
        onClick={() => setIsOpen(true)}
      >
        Pagado
      </Button>

      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={(value) => {
          const next = typeof value === 'function' ? value(isOpen) : value
          handleOpenChange(next)
        }}
        title="Marcar como pagado"
        description={`Le debés ${formatMoney(Math.abs(amount))} a ${crediterName}. Podés adjuntar comprobante y dejar una nota.`}
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

            <div className="grid gap-2">
              <FormLabel>Comprobante (opcional)</FormLabel>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null
                  setReceiptFile(file)
                  if (file) form.setValue('receiptLink', '')
                }}
              />

              {receiptFile
                ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-sm">{receiptFile.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => {
                        setReceiptFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Quitar archivo</span>
                    </Button>
                  </div>
                  )
                : (
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="mr-2 h-4 w-4" />
                    Subir imagen o PDF
                  </Button>
                  )}

              {!receiptFile && (
                <FormField
                  control={form.control}
                  name="receiptLink"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 space-y-0">
                      <FormControl>
                        <Input
                          placeholder="O pegá un link al comprobante"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP, GIF o PDF · máx. 4 MB
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Guardando…' : 'Confirmar pago'}
            </Button>
          </form>
        </Form>
      </ResponsiveDialog>
    </>
  )
}
