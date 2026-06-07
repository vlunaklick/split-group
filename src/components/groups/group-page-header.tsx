import { GroupNav } from './group-nav'
import { ReactNode } from 'react'

export function GroupPageHeader ({
  groupId,
  groupName,
  title,
  description,
  actions
}: {
  groupId: string
  groupName: string
  title?: string
  description?: string
  actions?: ReactNode
}) {
  const heading = title ?? groupName
  const showGroupName = title != null

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-1 flex-col gap-1">
          {showGroupName && (
            <p className="text-sm text-muted-foreground">{groupName}</p>
          )}
          <h1 className="text-display-sm">{heading}</h1>
          {description && (
            <p className="text-balance text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 gap-2">
            {actions}
          </div>
        )}
      </div>
      <GroupNav groupId={groupId} />
    </header>
  )
}
