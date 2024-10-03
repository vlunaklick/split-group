'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'
import { IconRefresh } from '@tabler/icons-react'
import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { CreateCommentForm } from '../forms/create-comment-form'
import { CommentsList } from '../lists/comments-list'
import { useSWRConfig } from 'swr'

export function CommentsSheet ({ spendingId, className }: { spendingId: string, className?: string }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isOpen, setIsOpen] = useState(false)
  const { mutate } = useSWRConfig()

  const refreshComments = () => {
    mutate(['spending-comments', spendingId])
  }

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className={className} asChild>
          <Button variant="outline">
            <MessageCircle className='mr-2 h-4 w-4' />
            Ver comentarios
          </Button>
        </SheetTrigger>
        <SheetContent className='flex flex-col gap-4 w-[400px] sm:w-[540px]'>
          <SheetHeader className='flex gap-4 items-center flex-row space-x-0 space-y-0'>
            <SheetTitle>Comentarios del gasto</SheetTitle>
            <Button variant='outline' onClick={refreshComments} size='icon'>
              <IconRefresh className='h-4 w-4' />
            </Button>
          </SheetHeader>
          <div className='space-y-4'>
            <ScrollArea className='h-[calc(100vh-200px)] pr-4'>
              <CommentsList spendingId={spendingId} />
            </ScrollArea>

            <CreateCommentForm spendingId={spendingId} />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className={className} asChild>
        <Button variant="outline">
          <MessageCircle className='mr-2 h-4 w-4' />
          Ver comentarios
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Comentarios del gasto</DrawerTitle>
        </DrawerHeader>

        <div className='p-4 overflow-y-auto max-h-96'>
          <ScrollArea className='h-[300px] pr-4'>
            <CommentsList spendingId={spendingId} />
          </ScrollArea>

          <CreateCommentForm spendingId={spendingId} />
        </div>

        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline" className='w-full'>Salir</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
