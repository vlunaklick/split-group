'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Step, StepItem, Stepper, useStepper } from '@/components/ui/stepper'
import { useGetGroupParticipnts } from '@/data/groups'
import { useGetAvailableCurrencies, useGetCategories } from '@/data/settings'
import { useGetSpendingById } from '@/data/spendings'
import { useMediaQuery } from '@/hooks/use-media-query'
import { updateSpendingSchema } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCoin, IconUser, IconUsers } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { z } from 'zod'
import { updateSpending } from '../actions'
import { DistributionModeType } from '../types'
import { DebtersForm, ExpeseInfoForm, PayersForm } from './steps'

export function EditSpendSheet ({ spendId, userId, groupId, className }: { spendId: string, userId: string, groupId: string, className?: string }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isOpen, setIsOpen] = useState(false)

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className={className} asChild>
          <Button variant="outline">Editar</Button>
        </SheetTrigger>
        <SheetContent style={{ width: '550px' }}>
          <SheetHeader>
            <SheetTitle>Editar gasto</SheetTitle>
            <SheetDescription>
              Aquí podrás editar el gasto que has creado.
            </SheetDescription>
            <EditSpendForm spendId={spendId} userId={userId} groupId={groupId} setIsOpen={setIsOpen} />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className={className} asChild>
        <Button variant="outline">Editar</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar gasto</DrawerTitle>
          <DrawerDescription>
            Aquí podrás editar el gasto que has creado.
          </DrawerDescription>
        </DrawerHeader>

        <div className='p-4 overflow-y-auto max-h-96'>
          <EditSpendForm spendId={spendId} userId={userId} groupId={groupId} setIsOpen={setIsOpen} />
        </div>

        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline" className='w-full'>Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const steps = [
  { label: 'Información del gasto', description: 'Ingresa la información del gasto', icon: IconUser },
  { label: 'Contribuyentes', description: 'Selecciona los contribuyentes', icon: IconCoin },
  { label: 'Deudores', description: 'Selecciona los deudores', icon: IconUsers }
] as StepItem[]

const EditSpendForm = ({ spendId, userId, groupId, setIsOpen }: { spendId: string, userId: string, groupId: string, setIsOpen: (value: boolean) => void }) => {
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
      setIsOpen(false)
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
