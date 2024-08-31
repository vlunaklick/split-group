'use client'

import { createSpending } from '@/app/(overview)/groups/[groupId]/spendings/actions'
import { DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { Button } from '@/components/ui/button'
import { Step, StepItem, Stepper, useStepper } from '@/components/ui/stepper'
import { useGetGroupParticipnts } from '@/data/groups'
import { useGetAvailableCurrencies, useGetCategories } from '@/data/settings'
import { createSpendingSchema } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCoin, IconUser, IconUsers } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { z } from 'zod'
import { PayersForm } from './payers-form'
import { DebtersForm } from './contributors-form'
import { ExpeseInfoForm } from './general-info-form'

// TODO: Add isLoading

const steps = [
  { label: 'Información del gasto', description: 'Ingresa la información del gasto', icon: IconUser },
  { label: 'Contribuyentes', description: 'Selecciona los contribuyentes', icon: IconCoin },
  { label: 'Deudores', description: 'Selecciona los deudores', icon: IconUsers }
] as StepItem[]

export const CreateSpendingForm = ({ groupId }: { groupId: string }) => {
  const [finalData, setFinalData] = useState<any>({})
  const [mode, setMode] = useState<DistributionModeType>('equal')
  const router = useRouter()
  const { mutate } = useSWRConfig()

  const { data: categories, isLoading: isLoadingCategories } = useGetCategories()
  const { data: currencies, isLoading: isLoadingCurrencies } = useGetAvailableCurrencies()
  const { data: participants, isLoading: isLoadingParticipants } = useGetGroupParticipnts({ groupId })

  const form = useForm<z.infer<typeof createSpendingSchema>>({
    resolver: zodResolver(createSpendingSchema),
    defaultValues: {
      name: '',
      amount: 0,
      description: '',
      categoryId: '',
      currencyId: ''
    }
  })

  const createSpendingFinalStep = async () => {
    try {
      await createSpending({
        groupId,
        mode,
        spending: {
          ...finalData
        }
      })
      toast.success('Gasto creado correctamente')
      mutate(['lastSpendings', groupId])
      mutate(['lastDebts', groupId])
      setTimeout(() => {
        router.push(`/groups/${groupId}/spendings`)
      }, 1000)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Stepper initialStep={0} steps={steps} orientation='vertical'>
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

        <LastStep onSubmit={createSpendingFinalStep} />
      </Stepper>
    </>
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
