"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { properties } from "@/lib/data"

const chartConfig = {
  occupied: {
    label: "Occupied",
    color: "hsl(var(--chart-2))",
  },
  vacant: {
    label: "Vacant",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function OccupancyChart() {
  const chartData = React.useMemo(() => {
    const occupied = properties.filter(p => p.status === 'Occupied').length;
    const vacant = properties.filter(p => p.status === 'Vacant').length;
    return [{ name: "occupied", value: occupied, fill: "var(--color-occupied)" }, { name: "vacant", value: vacant, fill: "var(--color-vacant)" }]
  }, []);
  
  const totalProperties = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [chartData])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">Property Occupancy</CardTitle>
        <CardDescription>Occupied vs. Vacant Properties</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-48"
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
              innerRadius={60}
              strokeWidth={5}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 5} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 15}
                    innerRadius={outerRadius + 5}
                  />
                </g>
              )}
            >
                <Label
                    content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                        <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                            >
                            {totalProperties.toLocaleString()}
                            </tspan>
                            <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                            >
                            Properties
                            </tspan>
                        </text>
                        )
                    }
                    }}
                />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
