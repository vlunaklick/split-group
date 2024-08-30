'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useGetMontlySpentGraph } from '@/data/dashboard'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

const chartConfig = {
  totalSpent: {
    label: 'Gastado',
    color: '#3b82f6'
  }
} satisfies ChartConfig

const defaultData = [{ month: 'Enero', totalSpent: 0 }, { month: 'Febrero', totalSpent: 0 }, { month: 'Marzo', totalSpent: 0 }, { month: 'Abril', totalSpent: 0 }, { month: 'Mayo', totalSpent: 0 }, { month: 'Junio', totalSpent: 0 }, { month: 'Julio', totalSpent: 0 }, { month: 'Agosto', totalSpent: 0 }, { month: 'Septiembre', totalSpent: 0 }, { month: 'Octubre', totalSpent: 0 }, { month: 'Noviembre', totalSpent: 0 }, { month: 'Diciembre', totalSpent: 0 }]

export const StatsChart = () => {
  const { data = defaultData } = useGetMontlySpentGraph()

  return (
    <Card className='xl:col-span-2'>
      <CardHeader>
        <CardTitle>Gasto anual</CardTitle>
        <CardDescription>
          Gasto mensual en los últimos 12 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
      <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              labelClassName='mr-2'
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="totalSpent"
              type="linear"
              fill="var(--color-totalSpent)"
              fillOpacity={0.4}
              stroke="var(--color-totalSpent)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
