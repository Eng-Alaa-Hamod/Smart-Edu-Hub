
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartConfig = {
  rate: {
    label: "Student Rate",
  },
  "achievement-0": {
    label: "Top #1",
    color: "#f59e0b",
  },
  "achievement-1": {
    label: "Top #2",
    color: "#10b981",
  },
  "achievement-2": {
    label: "Top #3",
    color: "#3b82f6",
  },
  "achievement-3": {
    label: "Top #4",
    color: "#8b5cf6",
  },
  "achievement-4": {
    label: "Top #5",
    color: "#ec4899",
  },
}

const StudentsRatesChart = ({ chartData }) => (
  <div className="w-full max-w-xl rounded-md border bg-background p-4">
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="name"
          tickLine={false}
          tickMargin={10}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
        <Bar
          activeBar={({ ...props }) => (
            <Rectangle
              {...(props)}
              fillOpacity={0.8}
              stroke={props.payload.fill}
              strokeDasharray={4}
              strokeDashoffset={4}
            />
          )}
          activeIndex={2}
          dataKey="rate"
          radius={8}
          strokeWidth={2}
        />
      </BarChart>
    </ChartContainer>
  </div>
)

export default StudentsRatesChart