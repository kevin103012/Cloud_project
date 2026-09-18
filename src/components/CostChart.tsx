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
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
          <XAxis dataKey="service" tick={{ fontSize: 12 }} stroke="#737373" tickLine={false} />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#737373"
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(v: number) => `$${v}`}
          />
          <Tooltip
            formatter={(v) => formatUSD(Number(v))}
            labelStyle={{ fontWeight: 600 }}
            contentStyle={{ borderRadius: 12, borderColor: '#E5E5E5' }}
          />
          <Bar
            dataKey="cost"
            name="Costo mensual"
            fill="#111111"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
