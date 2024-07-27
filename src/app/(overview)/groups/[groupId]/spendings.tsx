'use client'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export const Spendings = ({ userId, groupId }: { userId: string, groupId: string }) => {
  return (
    <Card className='md:max-w-[526px] w-full'>
      <CardHeader className='flex justify-between flex-row items-center'>
        <div className='flex flex-col gap-2'>
          <CardTitle>Gastos</CardTitle>
          <CardDescription>Últimos gastos ingresados</CardDescription>
        </div>

        <Link className={buttonVariants({ variant: 'default' })} href={`/groups/${groupId}/spendings/new`}>
          Nuevo gasto
        </Link>
      </CardHeader>
      <CardContent className='space-y-4'>

      </CardContent>
    </Card>
  )
}
