'use client'

import { Button } from '@/components/ui/button'
import { ResponsiveSheet } from '@/components/responsive-sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconRefresh } from '@tabler/icons-react'
import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { CreateCommentForm } from '../forms/create-comment-form'
import { CommentsList } from '../lists/comments-list'

export function CommentsSheet ({ spendingId, className }: { spendingId: string, className?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate } = useSWRConfig()

  const refreshComments = () => {
    mutate(['spending-comments', spendingId])
  }

  return (
    <ResponsiveSheet
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Comentarios"
      sheetWidth="540px"
      mobileCancelLabel="Cerrar"
      headerExtra={
        <Button variant="outline" onClick={refreshComments} size="icon" type="button">
          <IconRefresh className="h-4 w-4" />
          <span className="sr-only">Actualizar comentarios</span>
        </Button>
      }
      trigger={
        <Button variant="outline" className={className}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Comentarios
        </Button>
      }
    >
      <ScrollArea className="h-[min(400px,50vh)] pr-4">
        <CommentsList spendingId={spendingId} />
      </ScrollArea>
      <CreateCommentForm spendingId={spendingId} />
    </ResponsiveSheet>
  )
}
