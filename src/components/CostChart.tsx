import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TrendPoint } from '../types/cloud'
import { formatUSD } from '../utils/format'

interface CostChartProps {
  data: TrendPoint[]
}

export default function CostChart({ data }: CostChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#737373" tickLine={false} />
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
          <Line
            type="monotone"
            dataKey="cost"
            name="Costo"
            stroke="#111111"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
