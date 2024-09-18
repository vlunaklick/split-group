import { generateInvitationLink } from '@/app/(overview)/groups/[groupId]/participants/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { generateInvitationLinkSchema } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconLink, IconLoader2 } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { z } from 'zod'

export function GenerateInviteForm ({ groupId }: { groupId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const formLink = useForm<z.infer<typeof generateInvitationLinkSchema>>({
    resolver: zodResolver(generateInvitationLinkSchema),
    defaultValues: {
      maxUses: 1
    }
  })

  const onSubmit = async (values: z.infer<typeof generateInvitationLinkSchema>) => {
    const { maxUses } = values
    setIsLoading(true)

    try {
      await generateInvitationLink(groupId, maxUses)
      mutate(['/api/groups/link', groupId])
    } catch (error) {
      console.error(error)
      toast.error('Ha ocurrido un error al generar el enlace de invitación.')
    }

    toast.success('Enlace de invitación generado correctamente.')
    setIsLoading(false)
    formLink.reset()
  }

  return (
    <Form {...formLink}>
      <form onSubmit={formLink.handleSubmit(onSubmit)} className='space-y-2'>
        <FormField
          control={formLink.control}
          name="maxUses"
          render={({ field }: any) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel>
                Cantidad de usos
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="1"
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
                  <IconLink className='w-4 h-4' />
                  Generar enlace
                </span>
              )}
        </Button>
      </form>
    </Form>
  )
}
