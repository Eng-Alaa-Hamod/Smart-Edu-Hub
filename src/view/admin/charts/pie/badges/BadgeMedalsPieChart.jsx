
import { Label, Pie, PieChart, Sector } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const BadgeMedalsPieChart = ({ chartData, chartConfig }) => {
  const id = "pie-interactive"
  const activeIndex = 0
  const totalMedals = chartData.reduce((total, item) => total + item.medals, 0)

  return (
    <div className="w-full max-w-xl rounded-md border bg-background p-4">
      <ChartContainer
        className="mx-auto aspect-square w-full max-w-[300px]"
        config={chartConfig}
        id={id}
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
          <Pie
            activeIndex={activeIndex}
            activeShape={({ outerRadius = 0, ...props }) => (
              <g>
                <Sector {...(props)} outerRadius={outerRadius + 10} />
                <Sector
                  {...(props)}
                  innerRadius={outerRadius + 12}
                  outerRadius={outerRadius + 25}
                />
              </g>
            )}
            data={chartData}
            dataKey="medals"
            innerRadius={60}
            nameKey="medal"
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      dominantBaseline="middle"
                      textAnchor="middle"
                      x={viewBox.cx}
                      y={viewBox.cy}
                    >
                      <tspan
                        className="fill-foreground font-bold text-3xl"
                        x={viewBox.cx}
                        y={viewBox.cy}
                      >
                        {totalMedals.toLocaleString()}
                      </tspan>
                      <tspan
                        className="fill-muted-foreground"
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                      >
                        Medals
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  )
}

export default BadgeMedalsPieChart