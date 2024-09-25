'use client'

import { updateSpending } from '@/app/(overview)/groups/[groupId]/spendings/actions'
import { DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { Button } from '@/components/ui/button'
import { Step, StepItem, Stepper, useStepper } from '@/components/ui/stepper'
import { useGetGroupParticipnts } from '@/data/groups'
import { useGetAvailableCurrencies, useGetCategories } from '@/data/settings'
import { useGetSpendingById } from '@/data/spendings'
import { updateSpendingSchema } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCoin, IconUser, IconUsers } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { z } from 'zod'
import { DebtersForm } from './contributors-form'
import { ExpeseInfoForm } from './general-info-form'
import { PayersForm } from './payers-form'

const steps = [
  { label: 'Información del gasto', description: 'Ingresa la información del gasto', icon: IconUser },
  { label: 'Contribuyentes', description: 'Selecciona los contribuyentes', icon: IconCoin },
  { label: 'Deudores', description: 'Selecciona los deudores', icon: IconUsers }
] as StepItem[]

export const EditSpendingForm = ({ spendId, groupId, callback }: { spendId: string, groupId: string, callback?: () => void }) => {
  const { mutate } = useSWRConfig()
  const [finalData, setFinalData] = useState<any>({})
  const [mode, setMode] = useState<DistributionModeType>('equal')
  const [isLoading, setIsLoading] = useState(false)

  const { data: categories, isLoading: isLoadingCategories } = useGetCategories()
  const { data: currencies, isLoading: isLoadingCurrencies } = useGetAvailableCurrencies()
  const { data: participants, isLoading: isLoadingParticipants } = useGetGroupParticipnts({ groupId })
  const { data: spendData } = useGetSpendingById({ spendingId: spendId })

  const form = useForm<z.infer<typeof updateSpendingSchema>>({
    resolver: zodResolver(updateSpendingSchema),
    defaultValues: {
      name: '',
      amount: 0,
      description: '',
      categoryId: '',
      currencyId: ''
    }
  })

  useEffect(() => {
    if (spendData) {
      form.reset({
        name: spendData.name,
        amount: spendData.amount,
        description: spendData.description,
        categoryId: spendData.categoryId,
        currencyId: spendData.currencyId
      })
      setFinalData({
        name: spendData.name,
        amount: spendData.amount,
        description: spendData.description,
        categoryId: spendData.categoryId,
        currencyId: spendData.currencyId
      })
    }
  }, [spendData])

  const updateSpendingFinalStep = async () => {
    try {
      setIsLoading(true)
      await updateSpending({
        spendingId: spendId,
        mode,
        spending: {
          ...finalData
        }
      })
      toast.success('Gasto actualizado correctamente')
      mutate(['lastSpendings', groupId])
      mutate(['lastDebts', groupId])
      mutate(['spendings', groupId, spendId])

      if (callback) {
        callback()
      }
    } catch (error) {
      setIsLoading(false)
      toast.error('Ocurrió un error al actualizar el gasto')
    }
  }

  return (
    <Stepper initialStep={0} steps={steps} orientation='vertical' className='w-full'>
      <Step {...steps[0]} key={steps[0].label}>
        <ExpeseInfoForm form={form}
          categories={categories} currencies={currencies} isLoading={isLoadingCategories || isLoadingCurrencies} setFinalData={setFinalData} />
      </Step>

      <Step {...steps[1]} key={steps[1].label}>
        <PayersForm participants={participants} isLoading={isLoadingParticipants} totalAmount={finalData.amount} setFinalData={setFinalData} />
      </Step>

      <Step {...steps[2]} key={steps[2].label}>
        <DebtersForm participants={participants} isLoading={isLoadingParticipants} totalAmount={finalData.amount} setFinalData={setFinalData} payers={finalData.payers} mode={mode} setMode={setMode} />
      </Step>
      <LastStep onSubmit={updateSpendingFinalStep} isSubmitting={isLoading} />
    </Stepper>
  )
}

const LastStep = ({ onSubmit, isSubmitting }: { onSubmit: () => void, isSubmitting: boolean }) => {
  const { hasCompletedAllSteps, prevStep } = useStepper()

  if (!hasCompletedAllSteps) {
    return
  }

  return (
    <div className='flex flex-row gap-4 flex-wrap justify-center'>
      <Button variant='default' onClick={onSubmit} className='mx-auto' disabled={isSubmitting}>
        Actualizar gasto
      </Button>
      <Button variant='default' onClick={prevStep} className='mx-auto' disabled={isSubmitting}>
        Volver
      </Button>
    </div>
  )
}
