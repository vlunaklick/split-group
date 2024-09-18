import { updateGroup } from '@/app/(overview)/groups/[groupId]/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { updateGroupFormSchema } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconLoader2 } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { z } from 'zod'

export function ChangeInfoGroupForm ({ groupId }: { groupId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

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

  return (
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
  )
}
