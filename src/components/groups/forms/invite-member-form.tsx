import { inviteMemberToGroup } from '@/app/(overview)/groups/[groupId]/participants/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { inviteMemberSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircledIcon } from '@radix-ui/react-icons'
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name="email"
          render={({ field }: any) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel>
                Email del usuario
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="demo@example.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='w-full' disabled={isLoading}>
          {isLoading
            ? <IconLoader2 className='animate-spin' />
            : (
                <span className='flex items-center justify-center gap-2'>
                  <PlusCircledIcon className="h-4 w-4" />
                  Invitar miembro
                </span>
              )}
        </Button>
      </form>
    </Form>
  )
}
