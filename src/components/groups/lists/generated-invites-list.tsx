import { removeInvitationLink } from '@/app/(overview)/groups/[groupId]/participants/actions'
import { useGetInvitationLink } from '@/data/groups'
import { cn } from '@/lib/utils'
import { displayToast } from '@/utils/toast-display'
import { CheckCircle, Copy, X } from 'lucide-react'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { Button } from '../../ui/button'
import { Progress } from '../../ui/progress'
import { Skeleton } from '../../ui/skeleton'

export function GeneratedInvitesList ({ groupId, embedded = false }: { groupId: string, embedded?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const { data: invitations, isLoading: isLoadingMembers } = useGetInvitationLink({ groupId })

  const handleDeleteLink = async (code: string) => {
    setIsLoading(true)
    try {
      await removeInvitationLink(code, groupId)
      mutate(['/api/groups/invitation-link', groupId])
      displayToast('Enlace eliminado', 'success')
    } catch (error) {
      displayToast('No se pudo eliminar el enlace', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async (code: string) => {
    try {
      const url = `${window.location.origin}/join/${code}`
      await navigator.clipboard.writeText(url)
      displayToast('Enlace copiado', 'success')
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 3000)
    } catch (error) {
      displayToast('No se pudo copiar el enlace', 'error')
    }
  }

  const listClassName = cn(
    'divide-y divide-border',
    embedded ? 'overflow-hidden rounded-md border border-border bg-card' : 'surface-panel'
  )

  if (isLoadingMembers) {
    return (
      <ul className={listClassName}>
        <RowSkeleton />
      </ul>
    )
  }

  if (invitations?.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay enlaces generados.</p>
  }

  return (
    <ul className={listClassName}>
      {invitations?.map((invitation: any) => (
        <li key={invitation.code} className="grid gap-3 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <code className="truncate text-xs text-muted-foreground">
              …{invitation.code.slice(-8)}
            </code>
            <div className="flex shrink-0 gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopyLink(invitation.code)}
                disabled={isLoading}
                aria-label="Copiar enlace"
              >
                {copiedCode === invitation.code
                  ? <CheckCircle className="h-4 w-4 text-success" />
                  : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDeleteLink(invitation.code)}
                disabled={isLoading}
                aria-label="Eliminar enlace"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Progress
              value={(invitation.uses / invitation.maxUses) * 100}
              className="flex-1"
            />
            <span className="shrink-0 text-xs text-muted-foreground">
              {invitation.uses}/{invitation.maxUses}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

const RowSkeleton = () => (
  <li className="grid gap-3 px-4 py-3">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-2 w-full" />
  </li>
)
