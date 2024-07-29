import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { MonthlySpent, TotalDebt, TotalRevenue, WeeklySpent } from './stats'
import { StatsChart } from './chart'
import { LatestsSpendings } from './latest'

export default async function HomeDashboard () {
  const session = await getServerSession(authOptions)

  return (
    <div className='flex flex-col gap-8'>
      <header className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <WeeklySpent userId={session?.user.id as string} />
        <MonthlySpent userId={session?.user.id as string} />
        <TotalRevenue userId={session?.user.id as string} />
        <TotalDebt userId={session?.user.id as string} />
      </header>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
        <StatsChart userId={session?.user.id as string} />
        <LatestsSpendings userId={session?.user.id as string} />
      </div>
    </div>
  )
}
