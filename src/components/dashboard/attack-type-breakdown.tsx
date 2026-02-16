"use client"

import { Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { PieChartIcon } from "lucide-react"
import type { AttackTypeStat } from "@/lib/mock-data"
import { ATTACK_TYPE_LABELS, ATTACK_TYPE_COLORS } from "@/lib/constants"

interface AttackTypeBreakdownProps {
  data: AttackTypeStat[]
}

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "oklch(0.7 0.2 30)",
  "oklch(0.6 0.2 320)",
  "oklch(0.65 0.15 200)",
  "oklch(0.7 0.1 80)",
]

export function AttackTypeBreakdown({ data }: AttackTypeBreakdownProps) {
  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((d) => [
      d.type,
      {
        label: ATTACK_TYPE_LABELS[d.type],
        color: ATTACK_TYPE_COLORS[d.type],
      },
    ])
  )

  const chartData = data.map((d) => ({
    name: ATTACK_TYPE_LABELS[d.type],
    value: d.count,
    type: d.type,
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Attack Types
        </CardTitle>
        <PieChartIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              strokeWidth={2}
              stroke="var(--color-background)"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 grid grid-cols-2 gap-1 pb-4 text-xs">
          {data.slice(0, 6).map((d, i) => (
            <div key={d.type} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="truncate text-muted-foreground">
                {ATTACK_TYPE_LABELS[d.type]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
