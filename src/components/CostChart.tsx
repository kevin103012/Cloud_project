import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatUSD } from '../utils/format'

interface CostChartProps {
  data: { service: string; cost: number }[]
}

export default function CostChart({ data }: CostChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="service" tick={{ fontSize: 12 }} stroke="var(--chart-axis)" tickLine={false} />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="var(--chart-axis)"
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(v: number) => `$${v}`}
          />
          <Tooltip
            formatter={(v) => formatUSD(Number(v))}
            labelStyle={{ fontWeight: 600 }}
            contentStyle={{
              borderRadius: 12,
              borderColor: 'var(--app-border)',
              backgroundColor: 'var(--app-surface)',
              color: 'var(--app-text)',
            }}
          />
          <Bar
            dataKey="cost"
            name="Costo mensual"
            fill="var(--chart-primary)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
