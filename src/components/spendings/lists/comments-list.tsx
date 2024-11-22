import { deleteComment } from '@/app/(overview)/groups/[groupId]/spendings/[spendId]/actions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useGetSpendingComments } from '@/data/spendings'
import { useTimeAgo } from '@/utils/time'
import { displayToast } from '@/utils/toast-display'
import { EllipsisVertical, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { DeleteCommentDialog } from '../dialogs/delete-comment-dialog'

export function CommentsList ({ spendingId }: { spendingId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const { data, isLoading: isLoadingComments } = useGetSpendingComments({ spendingId })

  const onDelete = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteComment({ commentId: id })
      displayToast('Comentario eliminado correctamente', 'success')
      mutate(['spending-comments', spendingId])
    } catch (error) {
      displayToast('Error al eliminar comentario', 'error')
    }
    setIsLoading(false)
  }

  return (
    <>
      {isLoadingComments && (
        <SkeletonComment />
      )}

      {data?.commentsList?.length === 0 && <p className="text-sm text-muted-foreground">No hay comentarios en este gasto.</p>}

      {data && data?.commentsList && data.commentsList.map((comment: any) => (
        <CommentItem key={comment.id} comment={comment} onDelete={() => onDelete(comment.id)} isLoading={isLoading} isOwner={data.userId === comment.user.id} />
      ))}
    </>
  )
}

const CommentItem = ({ comment, onDelete, isLoading, isOwner }: { comment: any, onDelete: () => void, isLoading: boolean, isOwner: boolean }) => {
  const commentCreatedAt = new Date(comment.createdAt)
  const { timeAgo } = useTimeAgo(commentCreatedAt.getTime())
  const [isDeletedOpen, setIsDeleteOpen] = useState(false)

  return (
    <div className="mb-4 p-3 bg-secondary rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">
          {isOwner ? 'Tú' : comment.user.name}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{timeAgo}</span>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="cursor-pointer">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  <span>Eliminar</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteCommentDialog isDeleteOpen={isDeletedOpen} setIsDeleteOpen={setIsDeleteOpen} onDelete={onDelete} isLoading={isLoading} />
        </div>
      </div>
      <p>{comment.content}</p>
    </div>
  )
}

const SkeletonComment = () => {
  return (
    <div className="mb-4 p-3 bg-secondary rounded-lg animate-pulse">
      <div className="flex justify-between items-center mb-2">
        <div className="w-20 h-4 text-muted-foreground rounded-full"></div>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-4 text-muted-foreground rounded-full"></div>
        </div>
      </div>
      <div className="w-3/4 h-4 text-muted-foreground rounded-full"></div>
    </div>
  )
}
