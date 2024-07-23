'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { generateInvitationLinkSchema, inviteMemberSchema } from '@/lib/form'
import { Input } from '@/components/ui/input'
import { IconLoader2 } from '@tabler/icons-react'
import { generateInvitationLink, inviteMemberToGroup } from './actions'

export const InviteMembers = ({ groupId, userId }: { groupId: string, userId: string }) => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof inviteMemberSchema>>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      username: ''
    }
  })

  const formLink = useForm<z.infer<typeof generateInvitationLinkSchema>>({
    resolver: zodResolver(generateInvitationLinkSchema),
    defaultValues: {
      maxUses: 1
    }
  })

  const onSubmit = async (values: z.infer<typeof inviteMemberSchema>) => {
    const { username } = values
    setIsLoading(true)

    try {
      await inviteMemberToGroup(username, groupId)
    } catch (error) {
      console.error(error)
      toast.error('Ha ocurrido un error al invitar al miembro.')
    }

    toast.success('Miembro invitado correctamente.')
    setIsLoading(false)
    form.reset()
  }

  const onSubmitLink = async (values: z.infer<typeof generateInvitationLinkSchema>) => {
    const { maxUses } = values
    setIsLoading(true)

    try {
      await generateInvitationLink(groupId, maxUses)
    } catch (error) {
      console.error(error)
      toast.error('Ha ocurrido un error al generar el enlace de invitación.')
    }

    toast.success('Enlace de invitación generado correctamente.')
    setIsLoading(false)
    formLink.reset()
  }

  return (
    <Card className='md:max-w-[526px] w-full h-min'>
      <CardHeader>
        <CardTitle>Invitar miembros</CardTitle>
        <CardDescription>Invita a nuevos miembros a unirse a tu grupo</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormField
              control={form.control}
              name="username"
              render={({ field }: any) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>
                    Usuario
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="@usuario"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isLoading}>
              {isLoading ? <IconLoader2 className='animate-spin' /> : 'Invitar miembro'}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-800 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-white text-zinc-400 dark:text-zinc-500 dark:bg-black">
              O
            </span>
          </div>
        </div>
        <CardDescription>Generar un enlace de invitación</CardDescription>
        <Form {...formLink}>
          <form onSubmit={formLink.handleSubmit(onSubmitLink)} className='space-y-2'>
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
              {isLoading ? <IconLoader2 className='animate-spin' /> : 'Generar enlace de invitación'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
