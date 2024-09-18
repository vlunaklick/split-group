import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserByUsername } from '@/data/apis/users'
import { formatDate } from '@/lib/dates'
import { CalendarIcon, MailIcon } from 'lucide-react'
import { notFound } from 'next/navigation'

export async function Profile ({ username }: { username: string }) {
  const data = await getUserByUsername({ username })

  if (!data) {
    notFound()
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/20 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>
                {(data?.name ?? data?.username ?? data?.email)?.[0] ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <h2 className="text-2xl font-bold">{data.name}</h2>
              <div className="text-sm text-muted-foreground">@{data.username}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid gap-6">
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">Sobre mí</h3>
            <p className="text-muted-foreground">
              Proximamente...
            </p>
          </div>
          <Separator />
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="grid gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MailIcon className="h-5 w-5" />
                <span>{data.email}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5" />
                <span>+1 (555) 555-5555</span>
              </div> */}
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">Información</h3>
            <div className="grid gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <span>{formatDate(data.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const ProfileSkeleton = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/20 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <Skeleton className="w-32 h-8" />
              <div className="text-sm text-muted-foreground">
                <Skeleton className="w-20 h-5" />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 grid gap-6">
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">Sobre mí</h3>
            <Skeleton className="w-full h-6" />
          </div>
          <Separator />
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="grid gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MailIcon className="h-5 w-5" />
                <Skeleton className="w-20 h-6" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">Información</h3>
            <div className="grid gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <Skeleton className="w-20 h-6" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
