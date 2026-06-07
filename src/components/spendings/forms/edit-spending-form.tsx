'use client'

import { updateSpending } from '@/app/(overview)/groups/[groupId]/spendings/actions'
import { DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { Step, Stepper } from '@/components/ui/stepper'
import { useGetGroupParticipants } from '@/data/groups'
import { useGetAvailableCurrencies, useGetCategories } from '@/data/settings'
import { useGetSpendingById } from '@/data/spendings'
import { updateSpendingSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import { z } from 'zod'
import { DebtersForm } from './contributors-form'
import { GeneralInfoForm } from './general-info-form'
import { PayersForm } from './payers-form'
import { SPENDING_STEPS } from './spending-steps'

export const EditSpendingForm = ({ spendId, groupId, callback }: { spendId: string, groupId: string, callback?: () => void }) => {
  const { mutate } = useSWRConfig()
  const [finalData, setFinalData] = useState<any>({})
  const [mode, setMode] = useState<DistributionModeType>('equal')
  const [isLoading, setIsLoading] = useState(false)

  const { data: categories, isLoading: isLoadingCategories } = useGetCategories()
  const { data: currencies, isLoading: isLoadingCurrencies } = useGetAvailableCurrencies()
  const { data: participants, isLoading: isLoadingParticipants } = useGetGroupParticipants({ groupId })
  const { data: spendData } = useGetSpendingById({ spendingId: spendId })

  const form = useForm<z.infer<typeof updateSpendingSchema>>({
    resolver: zodResolver(updateSpendingSchema),
    defaultValues: {
      name: '',
      amount: 0,
      description: '',
      categoryId: '',
      currencyId: '',
      date: new Date()
    }
  })

  useEffect(() => {
    if (spendData) {
      form.reset({
        name: spendData.name,
        amount: spendData.amount,
        description: spendData.description,
        categoryId: spendData.categoryId,
        currencyId: spendData.currencyId,
        date: spendData.date ? new Date(spendData.date) : new Date()
      })
      setFinalData({
        name: spendData.name,
        amount: spendData.amount,
        description: spendData.description,
        categoryId: spendData.categoryId,
        currencyId: spendData.currencyId,
        date: spendData.date ? new Date(spendData.date) : new Date()
      })
    }
  }, [spendData, form])

  const updateSpendingFinalStep = async (spendingData: any) => {
    try {
      setIsLoading(true)
      await updateSpending({
        spendingId: spendId,
        mode,
        spending: spendingData
      })
      displayToast('Gasto actualizado correctamente', 'success')
      mutate(['last-spendings', groupId])
      mutate(['debts', groupId])
      mutate(['spendings-table', groupId])
      mutate(['spending', spendId])
      callback?.()
    } catch (error) {
      displayToast('Ocurrió un error al actualizar el gasto', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Stepper initialStep={0} steps={SPENDING_STEPS} orientation='vertical' className='w-full'>
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
          onSubmit={updateSpendingFinalStep}
          isSubmitting={isLoading}
          submitLabel="Actualizar gasto"
        />
      </Step>
    </Stepper>
  )
}
