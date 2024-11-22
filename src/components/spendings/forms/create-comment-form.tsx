'use client'

import { createComment } from '@/app/(overview)/groups/[groupId]/spendings/[spendId]/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createCommentSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconLoader2 } from '@tabler/icons-react'
import { Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import { z } from 'zod'

export function CreateCommentForm ({ spendingId }: { spendingId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const form = useForm<z.infer<typeof createCommentSchema>>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      comment: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof createCommentSchema>) => {
    const { comment } = values
    setIsLoading(true)

    try {
      await createComment({ spendingId, comment })
      mutate(['spending-comments', spendingId])
    } catch (error) {
      console.error(error)
      displayToast('Ha ocurrido un error al enviar el comentario.', 'error')
    }

    displayToast('Comentario enviado correctamente.', 'success')
    setIsLoading(false)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex items-center space-x-2 w-full'>
        <FormField
          control={form.control}
          name="comment"
          render={({ field }: any) => (
            <FormItem className="grid gap-2 space-y-0 w-full">
              <FormControl>
                <Input
                  placeholder="Añade un comentario..."
                  className="w-full"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size='icon' disabled={isLoading} className='flex-shrink-0'>
          {isLoading
            ? <IconLoader2 className='animate-spin' />
            : (
                <Send className='w-4 h-4' />
              )}
        </Button>
      </form>
    </Form>
  )
}
