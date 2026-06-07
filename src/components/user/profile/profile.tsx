import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserByUsername, getUserByUsernameWithEmail } from '@/data/apis/users'
import { authOptions } from '@/lib/auth'
import { formatDate } from '@/lib/dates'
import { CalendarIcon, MailIcon } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

export async function Profile ({ username }: { username: string }) {
  const session = await getServerSession(authOptions)
  const isOwnProfile = session?.user?.username === username

  const data = isOwnProfile
    ? await getUserByUsernameWithEmail({ username })
    : await getUserByUsername({ username })

  if (!data) {
    notFound()
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/20 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>
                {(data?.name ?? data?.username)?.[0] ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <h2 className="text-2xl font-bold">{data.name}</h2>
              <div className="text-sm text-muted-foreground">@{data.username}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">Miembro desde</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-5 w-5" />
              <span>{formatDate(data.createdAt)}</span>
            </div>
          </div>

          {isOwnProfile && 'email' in data && typeof data.email === 'string' && (
            <>
              <Separator />
              <div className="grid gap-2">
                <h3 className="text-lg font-semibold">Contacto</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MailIcon className="h-5 w-5" />
                  <span>{data.email}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export const ProfileSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/20 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
