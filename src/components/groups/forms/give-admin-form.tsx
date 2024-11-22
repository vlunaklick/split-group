'use client'

import { giveAdminPermission } from '@/app/(overview)/groups/[groupId]/participants/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetMembersWithoutAdministrator } from '@/data/groups'
import { giveAdminPermissionSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconLoader2 } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import { z } from 'zod'

export function GiveAdminForm ({ groupId }: { groupId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const { data: membersWithoutAdmins, isLoading: isLoadingMembersWithoutAdmin } = useGetMembersWithoutAdministrator({ groupId })

  const form = useForm<z.infer<typeof giveAdminPermissionSchema>>({
    resolver: zodResolver(giveAdminPermissionSchema),
    values: {
      userId: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof giveAdminPermissionSchema>) => {
    setIsLoading(true)
    try {
      await giveAdminPermission(values.userId, groupId)
      mutate(['/api/groups/admins', groupId])
      mutate(['/api/groups/members-without-admins', groupId])
    } catch (error) {
      displayToast('Hubo un error al otorgar permisos de administrador.', 'error')
      setIsLoading(false)
      return
    }
    displayToast('Permisos de administrador otorgados correctamente.', 'success')
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading || isLoadingMembersWithoutAdmin || membersWithoutAdmins?.length === 0}>
                <FormControl>
                  <SelectTrigger disabled={isLoading || isLoadingMembersWithoutAdmin || membersWithoutAdmins?.length === 0}>
                    <SelectValue placeholder={isLoadingMembersWithoutAdmin ? 'Cargando miembros...' : membersWithoutAdmins?.length === 0 ? 'No hay miembros disponibles' : 'Selecciona un miembro'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                {membersWithoutAdmins && membersWithoutAdmins?.length > 0 && (
                  membersWithoutAdmins.map((member: any) => (
                    <SelectItem key={member.id} value={member.id}>
                      @{member.username}
                    </SelectItem>
                  ))
                )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className='mt-2'
          disabled={isLoading || isLoadingMembersWithoutAdmin || membersWithoutAdmins?.length === 0}
        >
          {isLoading ? <IconLoader2 className='animate-spin' /> : 'Otorgar permisos'}
        </Button>
      </form>
    </Form>
  )
}
