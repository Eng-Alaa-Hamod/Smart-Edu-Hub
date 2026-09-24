
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  count: {
    label: "Courses",
  },
}

const barColors = ["#0f766e", "#2563eb", "#d97706", "#7c3aed", "#db2777"]

const TeacherCoursesBarChart = ({ chartData }) => (
  <div className="w-full max-w-xl rounded-md border bg-background p-4">
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 0,
        }}
      >
        <YAxis
          axisLine={false}
          dataKey="teacher"
          tickLine={false}
          tickMargin={10}
          type="category"
        />
        <XAxis dataKey="count" hide type="number" />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
        <Bar dataKey="count" layout="vertical" radius={5}>
          {chartData.map((entry, index) => (
            <Cell key={`teacher-${entry.teacher}-${index}`} fill={barColors[index % barColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  </div>
)

export default TeacherCoursesBarChart