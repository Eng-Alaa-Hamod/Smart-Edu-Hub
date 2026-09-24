import { Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const RoleUsersPieChart = ({chartData, chartConfig}) => (
  <div className="w-full max-w-xl rounded-md border bg-background p-4">
    <ChartContainer className="mx-auto aspect-square max-h-[250px] px-0" config={chartConfig}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="role" />} />
        <Pie
          data={chartData}
          dataKey="users"
          label={({ payload, ...props }) => (
            <text
              cx={props.cx}
              cy={props.cy}
              dominantBaseline={props.dominantBaseline}
              fill="hsla(var(--foreground))"
              textAnchor={props.textAnchor}
              x={props.x}
              y={props.y}
            >
              {payload.users}
            </text>
          )}
          labelLine={true}
          nameKey="role"
        />
      </PieChart>
    </ChartContainer>
  </div>
)

export default RoleUsersPieChart