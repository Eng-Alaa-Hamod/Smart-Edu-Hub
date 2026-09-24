import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  count: { label: "Enrollments", color: "#0f766e" },
};

const EnrollmentsLast7daysChart = ({ chartData }) => (
  <div className="w-full max-w-xl rounded-md border bg-background p-4">
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis axisLine={false} dataKey="day" tickLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
        <Line dataKey="count" dot={false} stroke="var(--color-count)" strokeWidth={2} type="natural" />
      </LineChart>
    </ChartContainer>
  </div>
);

export default EnrollmentsLast7daysChart;