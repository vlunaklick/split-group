'use client'

import { deleteGroup, updateGroup } from '@/app/(overview)/groups/[groupId]/settings/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useGetIsGroupOwner } from '@/data/groups'
import { updateGroupFormSchema } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconLoader2 } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { z } from 'zod'
import { Label } from '../ui/label'

export const GroupDetails = ({ groupId }: { groupId: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const { data: isGroupOwner, isLoading: isLoadingOwner } = useGetIsGroupOwner({ groupId })

  const form = useForm<z.infer<typeof updateGroupFormSchema>>({
    resolver: zodResolver(updateGroupFormSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof updateGroupFormSchema>) => {
    const { name, description } = values
    setIsLoading(true)

    try {
      await updateGroup(groupId, name, description)
      mutate('user-groups')
    } catch (error) {
      console.error(error)
      toast.error('Ha ocurrido un error al actualizar el grupo.')
    }

    toast.success('Grupo actualizado correctamente.')
    setIsLoading(false)
    form.reset()
  }

  const onDelete = async () => {
    setIsLoading(true)
    try {
      await deleteGroup(groupId)
      mutate('user-groups')
      toast.success('Grupo eliminado correctamente. Redirigiendo...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (error) {
      console.error(error)
      toast.error('Ha ocurrido un error al eliminar el grupo.')
    }
  }

  return (
    <Card className='md:max-w-[526px] w-full h-min'>
      <CardHeader>
        <CardTitle>Detalles del grupo</CardTitle>
        <CardDescription>Información general sobre el grupo</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name="name"
              render={({ field }: any) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>
                    Nombre del grupo
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Grupo de trabajo"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }: any) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>
                    Descripción del grupo
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Grupo de trabajo para el proyecto X"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isLoading}>
              {isLoading ? <IconLoader2 className='animate-spin' /> : 'Actualizar grupo'}
            </Button>
          </form>
        </Form>

        {!isLoadingOwner && isGroupOwner.isOwner && (
          <Button variant="destructive" disabled={!isGroupOwner.isOwner || isLoading} onClick={onDelete} className='w-full'>
            Eliminar grupo
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export const GroupDetailsSkeleton = () => {
  return (
    <Card className='md:max-w-[526px] w-full'>
      <CardHeader>
        <CardTitle>Detalles del grupo</CardTitle>
        <CardDescription>Información general sobre el grupo</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='animate-pulse space-y-4'>
          <div className='grid gap-2 space-y-0'>
            <Label htmlFor='name'>Nombre del grupo</Label>
            <Input name='name' disabled />
          </div>

          <div className='grid gap-2 space-y-0'>
            <Label htmlFor='description'>Descripción del grupo</Label>
            <Input name='description' disabled />
          </div>

          <Button disabled className='w-full'>
            <IconLoader2 className='animate-spin' />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
