'use client'

import { Step, StepItem, Stepper, useStepper } from '@/components/ui/stepper'
import { getAvailableCurrency, getGroupParticipants } from '@/lib/data'
import { IconCoin, IconUser, IconUsers } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import { createSpending, getCategories } from '../actions'
import { ExpeseInfoForm } from './general-info'
import { PayersForm } from './payers'
import { DebtersForm } from './contributors'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createSpendingSchema } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const steps = [
  { label: 'Información del gasto', description: 'Ingresa la información del gasto', icon: IconUser },
  { label: 'Contribuyentes', description: 'Selecciona los contribuyentes', icon: IconCoin },
  { label: 'Deudores', description: 'Selecciona los deudores', icon: IconUsers }
] as StepItem[]

export const CreateSpending = ({ groupId, userId }: { groupId: string; userId: string }) => {
  const [finalData, setFinalData] = useState<any>({})
  const router = useRouter()

  const { data: categories, isLoading: isLoadingCategories } = useSWR(['categories', userId], getCategories)
  const { data: currencies, isLoading: isLoadingCurrencies } = useSWR('currencies', getAvailableCurrency)
  const { data: participants, isLoading: isLoadingParticipants } = useSWR(['groupParticipants', groupId], async () => {
    return await getGroupParticipants(groupId)
  })

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
        spending: {
          userId,
          ...finalData
        }
      })
      toast.success('Gasto creado correctamente')
      setTimeout(() => {
        router.push(`/groups/${groupId}/spendings`)
      }, 1000)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Stepper initialStep={0} steps={steps}>
        <Step {...steps[0]} key={steps[0].label}>
          <ExpeseInfoForm form={form}
           categories={categories} currencies={currencies} isLoading={isLoadingCategories || isLoadingCurrencies} setFinalData={setFinalData} />
        </Step>
        <Step {...steps[1]} key={steps[1].label}>
          <PayersForm participants={participants} isLoading={isLoadingParticipants} totalAmount={finalData.amount} setFinalData={setFinalData} />
        </Step>
        <Step {...steps[2]} key={steps[2].label}>
          <DebtersForm participants={participants} isLoading={isLoadingParticipants} totalAmount={finalData.amount} setFinalData={setFinalData} payers={finalData.payers} />
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
