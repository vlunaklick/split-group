import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { CreateGroupFrom } from './form'

export default async function GroupCreate () {
  const session = await getServerSession(authOptions)

  return (
    <div className="mx-auto grid w-[350px] gap-4">
      <h1 className="text-3xl font-bold text-center">
        Creación de grupo
      </h1>

      <p className="text-balance text-muted-foreground text-center">
        Crea un nuevo grupo, invita a tus amigos y comienza a dividir gastos.
      </p>

      <CreateGroupFrom userId={session?.user?.id as string} />
    </div>
  )
}
