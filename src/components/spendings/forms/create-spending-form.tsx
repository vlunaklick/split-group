'use client'

import { createSpending } from '@/app/(overview)/groups/[groupId]/spendings/actions'
import { DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { Step, Stepper } from '@/components/ui/stepper'
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
import { SPENDING_STEPS } from './spending-steps'

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

  return (
    <Stepper initialStep={0} steps={SPENDING_STEPS} orientation='vertical'>
      <Step {...SPENDING_STEPS[0]} key={SPENDING_STEPS[0].label}>
        <GeneralInfoForm
          form={form}
          categories={categories}
          currencies={currencies}
          isLoading={isLoadingCategories || isLoadingCurrencies}
          setFinalData={setFinalData}
        />
      </Step>
      <Step {...SPENDING_STEPS[1]} key={SPENDING_STEPS[1].label}>
        <PayersForm
          participants={participants}
          isLoading={isLoadingParticipants}
          totalAmount={finalData.amount}
          setFinalData={setFinalData}
        />
      </Step>
      <Step {...SPENDING_STEPS[2]} key={SPENDING_STEPS[2].label}>
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
      </Step>
    </Stepper>
  )
}
