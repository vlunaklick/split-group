import { inviteMemberToGroup } from '@/app/(overview)/groups/[groupId]/participants/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { inviteMemberSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconLoader2 } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import { z } from 'zod'

export function InviteMemberForm ({ groupId }: { groupId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const form = useForm<z.infer<typeof inviteMemberSchema>>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof inviteMemberSchema>) => {
    const { email } = values
    setIsLoading(true)

    try {
      const response = await inviteMemberToGroup(email, groupId)
      if (response?.error) {
        displayToast(response.error, 'error')
        setIsLoading(false)
        return
      }
      displayToast('Miembro invitado correctamente.', 'success')
      setIsLoading(false)
      mutate(['/api/groups/members/invited', groupId])
      form.reset()
    } catch (error) {
      console.error(error)
      displayToast('Ha ocurrido un error al invitar al miembro.', 'error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }: any) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="nombre@ejemplo.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <IconLoader2 className="animate-spin" /> : 'Enviar invitación'}
        </Button>
      </form>
    </Form>
  )
}
