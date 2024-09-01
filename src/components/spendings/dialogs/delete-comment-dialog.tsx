import { ResponsiveDialog } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'

export function DeleteCommentDialog ({ onDelete, isLoading, isDeleteOpen, setIsDeleteOpen }: { onDelete: () => void, isLoading: boolean, isDeleteOpen: boolean, setIsDeleteOpen: (open: boolean) => void }) {
  return (
    <ResponsiveDialog
      isOpen={isDeleteOpen}
      // @ts-ignore
      setIsOpen={setIsDeleteOpen}
      title="Borrar comentario"
      description="¿Estás seguro que deseas borrar este comentario?"
    >
      <Button type="submit" variant="destructive" onClick={onDelete} disabled={isLoading} className="w-full">
        Confirmar
      </Button>
    </ResponsiveDialog>
  )
}
