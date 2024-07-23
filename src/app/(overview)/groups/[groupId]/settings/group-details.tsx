'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { updateGroupFormSchema } from '@/lib/form'
import { deleteGroup, updateGroup } from '@/lib/data'
import { Input } from '@/components/ui/input'
import { IconLoader2 } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useSWRConfig } from 'swr'

export const GroupDetails = ({ groupId, userId }: { groupId: string, userId: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()
  const router = useRouter()

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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
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

        <Button variant='destructive' className='w-full' onClick={onDelete} disabled={isLoading}>
          Eliminar grupo
        </Button>
      </CardContent>
    </Card>
  )
}
