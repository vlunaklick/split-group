'use client'

import { createSpending } from '@/app/(overview)/groups/[groupId]/spendings/actions'
import { DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { FormStep, FormStepsProvider } from '@/components/ui/form-steps'
import { useGetGroupParticipants } from '@/data/groups'
import { useGetAvailableCurrencies, useGetCategories } from '@/data/settings'
import { createSpendingSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import { z } from 'zod'
import { DebtersForm } from './contributors-form'
import { GeneralInfoForm } from './general-info-form'
import { PayersForm } from './payers-form'

const STEP_LABELS = ['Detalle', 'Pago', 'División']

export const CreateSpendingForm = ({
  groupId,
  onSuccess
}: {
  groupId: string
  onSuccess?: () => void
}) => {
  const [finalData, setFinalData] = useState<any>({})
  const [mode, setMode] = useState<DistributionModeType>('equal')
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const { data: categories, isLoading: isLoadingCategories } = useGetCategories()
  const { data: currencies, isLoading: isLoadingCurrencies } = useGetAvailableCurrencies()
  const { data: participants, isLoading: isLoadingParticipants } = useGetGroupParticipants({ groupId })

  const form = useForm<z.infer<typeof createSpendingSchema>>({
    resolver: zodResolver(createSpendingSchema),
    defaultValues: {
      name: '',
      amount: 0,
      description: '',
      categoryId: '',
      currencyId: '',
      date: new Date()
    }
  })

  const refreshGroupData = () => {
    mutate(['last-spendings', groupId])
    mutate(['debts', groupId])
    mutate(['spendings-table', groupId])
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

  return (
    <FormStepsProvider steps={STEP_LABELS}>
      <FormStep index={0}>
        <GeneralInfoForm
          form={form}
          categories={categories}
          currencies={currencies}
          isLoading={isLoadingCategories || isLoadingCurrencies}
          setFinalData={setFinalData}
        />
      </FormStep>
      <FormStep index={1}>
        <PayersForm
          participants={participants}
          isLoading={isLoadingParticipants}
          totalAmount={finalData.amount}
          finalData={finalData}
          setFinalData={setFinalData}
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
        />
      </FormStep>
    </FormStepsProvider>
  )
}
