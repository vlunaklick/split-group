import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { MonthlySpent, TotalDebt, TotalRevenue, WeeklySpent } from './stats'

export default async function HomeDashboard () {
  const session = await getServerSession(authOptions)

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <WeeklySpent userId={session?.user.id as string} />
      <MonthlySpent userId={session?.user.id as string} />
      <TotalRevenue userId={session?.user.id as string} />
      <TotalDebt userId={session?.user.id as string} />

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">

      </div>
    </div>
  )
}
