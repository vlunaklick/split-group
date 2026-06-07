'use client'

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useGetMontlySpentGraph } from '@/data/dashboard'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

const chartConfig = {
  totalSpent: {
    label: 'Gastado',
    color: 'hsl(var(--primary))'
  }
} satisfies ChartConfig

const defaultData = [
  { month: 'Enero', totalSpent: 0 },
  { month: 'Febrero', totalSpent: 0 },
  { month: 'Marzo', totalSpent: 0 },
  { month: 'Abril', totalSpent: 0 },
  { month: 'Mayo', totalSpent: 0 },
  { month: 'Junio', totalSpent: 0 },
  { month: 'Julio', totalSpent: 0 },
  { month: 'Agosto', totalSpent: 0 },
  { month: 'Septiembre', totalSpent: 0 },
  { month: 'Octubre', totalSpent: 0 },
  { month: 'Noviembre', totalSpent: 0 },
  { month: 'Diciembre', totalSpent: 0 }
]

export const StatsChart = () => {
  const { data = defaultData } = useGetMontlySpentGraph()

  return (
    <div className="surface-panel min-w-0 max-w-full p-4 sm:p-5">
      <ChartContainer config={chartConfig} className="aspect-[3/1] min-h-[200px] w-full min-w-0 max-w-full">
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
            className="text-xs"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="totalSpent"
            type="monotone"
            fill="var(--color-totalSpent)"
            fillOpacity={0.15}
            stroke="var(--color-totalSpent)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
