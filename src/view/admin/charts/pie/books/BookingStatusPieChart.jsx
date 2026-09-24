
import { Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const BookingStatusPieChart = ({chartData, chartConfig}) => (
  <div className="w-full max-w-xl rounded-md border bg-background p-4">
    <ChartContainer className="mx-auto aspect-square max-h-[250px]" config={chartConfig}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="status" />} cursor={false} />
        <Pie data={chartData} dataKey="bookings" nameKey="status" stroke="0" />
      </PieChart>
    </ChartContainer>
  </div>
)

export default BookingStatusPieChart