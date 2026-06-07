'use client'

import { createSpending } from '@/app/(overview)/groups/[groupId]/spendings/actions'
import { DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { FormStep, FormStepsProvider } from '@/components/ui/form-steps'
import { useGetGroupParticipants } from '@/data/groups'
import { useGetAvailableCurrencies, useGetCategories } from '@/data/settings'
import { createSpendingSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import { z } from 'zod'
import { DebtersForm } from './contributors-form'
import { GeneralInfoForm } from './general-info-form'
import { PayersForm } from './payers-form'
import { SpendingPrefill, SpendingTemplatePicker } from './spending-prefill'

const STEP_LABELS = ['Detalle', 'Pago', 'División']

export const CreateSpendingForm = ({
  groupId,
  onSuccess,
  prefill
}: {
  groupId: string
  onSuccess?: () => void
  prefill?: SpendingPrefill
}) => {
  const [finalData, setFinalData] = useState<any>(() => (
    prefill
      ? {
          name: prefill.name,
          amount: prefill.amount,
          description: prefill.description ?? '',
          categoryId: prefill.categoryId,
          currencyId: prefill.currencyId,
          date: prefill.date,
          payers: prefill.payers,
          debters: prefill.debters
        }
      : {}
  ))
  const [mode, setMode] = useState<DistributionModeType>(prefill?.mode ?? 'equal')
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const { data: categories, isLoading: isLoadingCategories } = useGetCategories()
  const { data: currencies, isLoading: isLoadingCurrencies } = useGetAvailableCurrencies()
  const { data: participants, isLoading: isLoadingParticipants } = useGetGroupParticipants({ groupId })

  const form = useForm<z.infer<typeof createSpendingSchema>>({
    resolver: zodResolver(createSpendingSchema),
    defaultValues: {
      name: prefill?.name ?? '',
      amount: prefill?.amount ?? 0,
      description: prefill?.description ?? '',
      categoryId: prefill?.categoryId ?? '',
      currencyId: prefill?.currencyId ?? '',
      date: prefill?.date ?? new Date()
    }
  })

  useEffect(() => {
    if (!prefill) return

    form.reset({
      name: prefill.name,
      amount: prefill.amount,
      description: prefill.description ?? '',
      categoryId: prefill.categoryId,
      currencyId: prefill.currencyId,
      date: prefill.date ?? new Date()
    })
    setMode(prefill.mode ?? 'equal')
    setFinalData({
      name: prefill.name,
      amount: prefill.amount,
      description: prefill.description ?? '',
      categoryId: prefill.categoryId,
      currencyId: prefill.currencyId,
      date: prefill.date,
      payers: prefill.payers,
      debters: prefill.debters
    })
  }, [prefill, form])

  const refreshGroupData = () => {
    mutate(['last-spendings', groupId])
    mutate(['debts', groupId])
    mutate(['group-settlement', groupId])
    mutate(['spendings-table', groupId])
    mutate('user-onboarding')
    mutate(['group-onboarding', groupId])
    mutate(['group-activity', groupId])
  }

  const createSpendingFinalStep = async (spendingData: any) => {
    try {
      setIsLoading(true)
      await createSpending({ groupId, mode, spending: spendingData })
      displayToast('Gasto creado correctamente', 'success')
      refreshGroupData()
      onSuccess?.()
    } catch (error) {
      displayToast('Ocurrió un error al crear el gasto', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExpressSubmit = async (spendingData: any) => {
    if (!participants?.length || mode !== 'equal') {
      setFinalData((prev: any) => ({ ...prev, ...spendingData }))
      return false
    }

    const payers = spendingData.payers ?? []
    if (payers.length !== 1 || payers[0].amount !== spendingData.amount) {
      setFinalData((prev: any) => ({ ...prev, ...spendingData }))
      return false
    }

    const payerIds = new Set(payers.map((p: { userId: string }) => p.userId))
    const eligible = participants.filter((p: { id: string }) => !payerIds.has(p.id))

    if (eligible.length === 0) {
      setFinalData((prev: any) => ({ ...prev, ...spendingData }))
      return false
    }

    await createSpendingFinalStep({
      ...spendingData,
      debters: eligible.map((p: { id: string }) => ({ userId: p.id, amount: 0 }))
    })
    return true
  }

  const applyPrefill = (next: SpendingPrefill) => {
    form.reset({
      name: next.name,
      amount: next.amount,
      description: next.description ?? '',
      categoryId: next.categoryId,
      currencyId: next.currencyId,
      date: next.date ?? new Date()
    })
    setMode(next.mode ?? 'equal')
    setFinalData({
      name: next.name,
      amount: next.amount,
      description: next.description ?? '',
      categoryId: next.categoryId,
      currencyId: next.currencyId,
      date: next.date,
      payers: next.payers,
      debters: next.debters
    })
  }

  const formValues = form.watch()

  return (
    <FormStepsProvider steps={STEP_LABELS}>
      <FormStep index={0}>
        <div className="grid gap-5">
          <SpendingTemplatePicker
            groupId={groupId}
            formValues={{
              name: formValues.name ?? '',
              amount: formValues.amount ?? 0,
              description: formValues.description,
              categoryId: formValues.categoryId ?? '',
              currencyId: formValues.currencyId ?? ''
            }}
            onApply={applyPrefill}
          />
          <GeneralInfoForm
            form={form}
            categories={categories}
            currencies={currencies}
            isLoading={isLoadingCategories || isLoadingCurrencies}
            setFinalData={setFinalData}
          />
        </div>
      </FormStep>
      <FormStep index={1}>
        <PayersForm
          participants={participants}
          isLoading={isLoadingParticipants}
          totalAmount={finalData.amount}
          finalData={finalData}
          setFinalData={setFinalData}
          initialPayers={prefill?.payers ?? finalData.payers}
          onExpressSubmit={handleExpressSubmit}
          isSubmitting={isLoading}
        />
      </FormStep>
      <FormStep index={2}>
        <DebtersForm
          participants={participants}
          isLoading={isLoadingParticipants}
          totalAmount={finalData.amount}
          finalData={finalData}
          setFinalData={setFinalData}
          payers={finalData.payers}
          mode={mode}
          setMode={setMode}
          onSubmit={createSpendingFinalStep}
          isSubmitting={isLoading}
          submitLabel="Crear gasto"
          initialDebters={prefill?.debters ?? finalData.debters}
        />
      </FormStep>
    </FormStepsProvider>
  )
}
