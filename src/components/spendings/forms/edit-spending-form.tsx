'use client'

import { DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { Button } from '@/components/ui/button'
import { Step, StepItem, Stepper, useStepper } from '@/components/ui/stepper'
import { useGetGroupParticipnts } from '@/data/groups'
import { useGetAvailableCurrencies, useGetCategories } from '@/data/settings'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCoin, IconUser, IconUsers } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { z } from 'zod'
import { PayersForm } from '../payers'
import { DebtersForm } from '../contributors'
import { ExpeseInfoForm } from '../general-info'
import { updateSpendingSchema } from '@/lib/form'
import { useGetSpendingById } from '@/data/spendings'
import { updateSpending } from '@/app/(overview)/groups/[groupId]/spendings/actions'

// TODO: Add isLoading
// TODO: Arreglar el error que sale acá
const steps = [
  { label: 'Información del gasto', description: 'Ingresa la información del gasto', icon: IconUser },
  { label: 'Contribuyentes', description: 'Selecciona los contribuyentes', icon: IconCoin },
  { label: 'Deudores', description: 'Selecciona los deudores', icon: IconUsers }
] as StepItem[]

export const EditSpendingForm = ({ spendId, userId, groupId }: { spendId: string, userId: string, groupId: string }) => {
  const [finalData, setFinalData] = useState<any>({})
  const [mode, setMode] = useState<DistributionModeType>('equal')
  const { mutate } = useSWRConfig()

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
    },
    values: {
      name: spendData?.name || '',
      amount: spendData?.value || 0,
      description: spendData?.description || '',
      categoryId: spendData?.categoryId || '',
      currencyId: spendData?.currencyId || '',
      date: new Date(spendData?.date || new Date())
    }
  })

  const updateSpendingFinalStep = async () => {
    try {
      await updateSpending({
        spendingId: spendId,
        mode,
        spending: {
          userId,
          ...finalData
        }
      })
      toast.success('Gasto actualizado correctamente')
      mutate(['lastSpendings', groupId])
      mutate(['lastDebts', groupId, userId])
      mutate(['spendings', groupId, spendId])
    } catch (error) {
      console.error(error)
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
      <LastStep onSubmit={updateSpendingFinalStep} />
    </Stepper>
  )
}

const LastStep = ({ onSubmit }: { onSubmit: () => void }) => {
  const { hasCompletedAllSteps, prevStep } = useStepper()

  if (!hasCompletedAllSteps) {
    return
  }

  return (
    <>
      <Button variant='default' onClick={onSubmit} className='mx-auto'>Cargar gasto</Button>
      <Button variant='default' onClick={prevStep} className='mx-auto'>Volver</Button>
    </>
  )
}
