import { Button, buttonVariants } from '@/components/ui/button'
import { hasGroupAdminPermission } from '@/data/apis/groups'
import { ExportButton } from './export-button'
import { GroupConfigSheet } from './sheets/group-config-sheet'
import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'

export const HeaderButtons = async ({ groupId }: { groupId: string }) => {
  const hasPermission = await hasGroupAdminPermission(groupId)

  return (
    <>
      <CreateSpendingSheet groupId={groupId} variant="default" />
      <ExportButton groupId={groupId} />
      {hasPermission && (
        <GroupConfigSheet groupId={groupId} />
      )}
    </>
  )
}

export const HeaderButtonsMobile = async ({ groupId }: { groupId: string }) => {
  const hasPermission = await hasGroupAdminPermission(groupId)

  return (
    <div className="flex gap-2 md:hidden shrink-0">
      <CreateSpendingSheet groupId={groupId} variant="default" className="[&_button]:px-3 [&_button]:text-sm" />
      <ExportButton groupId={groupId} triggerIcon />
      {hasPermission && (
        <GroupConfigSheet groupId={groupId} />
      )}
    </div>
  )
}

export const HeaderButtonsSkeletons = () => {
  return (
    <>
      <div className="hidden md:flex gap-2">
        <Button disabled>Crear gasto</Button>
        <Button variant="outline" disabled>
          Exportar
        </Button>
      </div>

      <div className="flex gap-2 md:hidden">
        <Button size="sm" disabled>Crear</Button>
      </div>
    </>
  )
}
