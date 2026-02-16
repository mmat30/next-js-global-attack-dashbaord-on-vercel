"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import type { TimelinePoint } from "@/lib/mock-data"

interface AttackTimelineProps {
  data: TimelinePoint[]
}

const chartConfig: ChartConfig = {
  attacks: {
    label: "Attacks",
    color: "var(--color-chart-3)",
  },
  blocked: {
    label: "Blocked",
    color: "var(--color-chart-1)",
  },
}

export function AttackTimeline({ data }: AttackTimelineProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Attack Timeline (24h)
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer config={chartConfig} className="h-[230px] w-full">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillAttacks" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-3)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-3)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillBlocked" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="attacks"
              stroke="var(--color-chart-3)"
              fill="url(#fillAttacks)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="blocked"
              stroke="var(--color-chart-1)"
              fill="url(#fillBlocked)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
