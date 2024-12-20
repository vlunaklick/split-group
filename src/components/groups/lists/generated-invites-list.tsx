import { removeInvitationLink } from '@/app/(overview)/groups/[groupId]/participants/actions'
import { useGetInvitationLink } from '@/data/groups'
import { displayToast } from '@/utils/toast-display'
import { CheckCircle, Copy, X } from 'lucide-react'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { Button } from '../../ui/button'
import { Progress } from '../../ui/progress'
import { Skeleton } from '../../ui/skeleton'

export function GeneratedInvitesList ({ groupId }: { groupId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  const { data: invitations, isLoading: isLoadingMembers } = useGetInvitationLink({ groupId })

  const handleDeleteLink = async (code: string) => {
    setIsLoading(true)
    try {
      await removeInvitationLink(code)
      mutate(['/api/groups/invitation-link', groupId])
    } catch (error) {
      displayToast('Hubo un error al enviar la invitación al miembro.', 'error')
      return
    }

    displayToast('Invitación eliminada correctamente.', 'success')
    setIsLoading(false)
  }

  const handleCopyLink = async (code: string) => {
    try {
      const url = `${window.location.origin}/join/${code}`
      await navigator.clipboard.writeText(url)
      displayToast('Enlace copiado al portapapeles.', 'success')
      setCopiedLink(url)
      setTimeout(() => {
        setCopiedLink(null)
      }, 3000)
    } catch (error) {
      displayToast('Hubo un error al copiar el enlace al portapapeles.', 'error')
    }
  }

  return (
    <article>
      <header>
        <h3 className="text-lg font-medium">Enlaces de invitación generados</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Estos son los enlaces de invitación que has generado para que otros miembros se unan a este grupo
        </p>
      </header>
        {isLoadingMembers && (
          <ul className='space-y-2'>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </ul>
        )}
        {invitations?.length === 0 && (
          <p className='text-sm text-muted-foreground/50'>No has generado ningún enlace de invitación para este grupo.</p>
        )}
        {invitations?.length > 0 && (
          <ul className='space-y-2'>
            {invitations?.map((invitation: any) => (
              <li key={invitation.code} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate mr-2">{invitation.code.slice(0, 6) + '...' + invitation.code.slice(-5)}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyLink(invitation.code)}
                      disabled={isLoading}
                    >
                      {copiedLink === invitation.link
                        ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                          )
                        : (
                        <Copy className="h-4 w-4" />
                          )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteLink(invitation.code)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {invitation.uses} de {invitation.maxUses} usos
                  </span>
                  <Progress
                    value={(invitation.uses / invitation.maxUses) * 100}
                    className="w-1/2"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
    </article>
  )
}

const RowSkeleton = () => {
  return (
    <li className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <Skeleton className="h-4 w-24 mr-2" />
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" disabled>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </li>
  )
}
