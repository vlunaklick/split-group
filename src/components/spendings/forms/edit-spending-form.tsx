'use client'

import { updateSpending } from '@/app/(overview)/groups/[groupId]/spendings/actions'
import { DistributionMode, DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { Step, Stepper } from '@/components/ui/stepper'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupParticipants } from '@/data/groups'
import { useGetAvailableCurrencies, useGetCategories } from '@/data/settings'
import { useGetSpendingById } from '@/data/spendings'
import { updateSpendingSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import { z } from 'zod'
import { DebtersForm } from './contributors-form'
import { GeneralInfoForm } from './general-info-form'
import { PayersForm } from './payers-form'
import { SPENDING_STEPS } from './spending-steps'

function buildDebtersFromSpending (debts: { debterId: string, amount: number }[]) {
  const map = new Map<string, number>()
  debts.forEach((debt) => {
    map.set(debt.debterId, (map.get(debt.debterId) ?? 0) + debt.amount)
  })
  return Array.from(map.entries()).map(([userId, amount]) => ({ userId, amount }))
}

function detectMode (debters: { amount: number }[]): DistributionModeType {
  if (debters.length === 0) return DistributionMode.EQUAL
  const first = debters[0].amount
  return debters.every((d) => d.amount === first) ? DistributionMode.EQUAL : DistributionMode.CUSTOM
}

export const EditSpendingForm = ({ spendId, groupId, callback }: { spendId: string, groupId: string, callback?: () => void }) => {
  const { mutate } = useSWRConfig()
  const [finalData, setFinalData] = useState<any>({})
  const [mode, setMode] = useState<DistributionModeType>(DistributionMode.EQUAL)
  const [isLoading, setIsLoading] = useState(false)

  const { data: categories, isLoading: isLoadingCategories } = useGetCategories()
  const { data: currencies, isLoading: isLoadingCurrencies } = useGetAvailableCurrencies()
  const { data: participants, isLoading: isLoadingParticipants } = useGetGroupParticipants({ groupId })
  const { data: spendData, isLoading: isLoadingSpend } = useGetSpendingById({ spendingId: spendId })

  const initialPayers = useMemo(() => (
    spendData?.payments?.map((p: { payerId: string, amount: number }) => ({
      userId: p.payerId,
      amount: p.amount
    })) ?? []
  ), [spendData])

  const initialDebters = useMemo(() => (
    spendData?.debts ? buildDebtersFromSpending(spendData.debts) : []
  ), [spendData])

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
    if (!spendData) return

    const payers = initialPayers
    const debters = initialDebters
    const nextMode = detectMode(debters)

    form.reset({
      name: spendData.name,
      amount: spendData.value,
      description: spendData.description ?? '',
      categoryId: spendData.categoryId,
      currencyId: spendData.currencyId,
      date: spendData.date ? new Date(spendData.date) : new Date()
    })

    setMode(nextMode)
    setFinalData({
      name: spendData.name,
      amount: spendData.value,
      description: spendData.description ?? '',
      categoryId: spendData.categoryId,
      currencyId: spendData.currencyId,
      date: spendData.date ? new Date(spendData.date) : new Date(),
      payers,
      debters
    })
  }, [spendData, form, initialPayers, initialDebters])

  const updateSpendingFinalStep = async (spendingData: any) => {
    try {
      setIsLoading(true)
      await updateSpending({ spendingId: spendId, mode, spending: spendingData })
      displayToast('Gasto actualizado', 'success')
      mutate(['last-spendings', groupId])
      mutate(['debts', groupId])
      mutate(['spendings-table', groupId])
      mutate(['spending', spendId])
      mutate(['payers', groupId, spendId])
      mutate(['spending-participants', groupId, spendId])
      callback?.()
    } catch (error) {
      displayToast('No se pudo actualizar el gasto', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingSpend || !spendData) {
    return (
      <div className="grid gap-4 py-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <Stepper initialStep={0} steps={SPENDING_STEPS} orientation="vertical" className="w-full">
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
          totalAmount={finalData.amount ?? spendData.value}
          setFinalData={setFinalData}
          initialPayers={initialPayers}
        />
      </Step>
      <Step {...SPENDING_STEPS[2]} key={SPENDING_STEPS[2].label}>
        <DebtersForm
          participants={participants}
          isLoading={isLoadingParticipants}
          totalAmount={finalData.amount ?? spendData.value}
          finalData={finalData}
          setFinalData={setFinalData}
          payers={finalData.payers ?? initialPayers}
          mode={mode}
          setMode={setMode}
          onSubmit={updateSpendingFinalStep}
          isSubmitting={isLoading}
          submitLabel="Guardar cambios"
          initialDebters={initialDebters}
        />
      </Step>
    </Stepper>
  )
}
