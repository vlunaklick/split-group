import { getGroup } from '@/lib/data'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function GroupId ({ params } : { params: { groupId: string } }) {
  const groupId = params.groupId

  if (!groupId) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  const group = await getGroup(groupId)

  if (!group || !group.users.find(user => user.id === session?.user?.id)) {
    notFound()
  }

  return (
    <>
      <header className="flex md:justify-between md:items-center gap-4 flex-col md:flex-row">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 justify-between">
            <h1 className="text-3xl font-semibold">{group.name}</h1>
          </div>
          <p className="text-balance text-zinc-400">{group.description}</p>
        </div>

        <div className="flex gap-2">
        </div>
      </header>

      <div className="grid gap-4">
      </div>
    </>
  )
}
