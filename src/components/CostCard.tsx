import type { CostItem } from '../types/cloud'
import { formatUSD } from '../utils/format'

interface CostCardProps {
  item: CostItem
  periodLabel: string
  subtotal: number
}

export default function CostCard({ item, periodLabel, subtotal }: CostCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-black">{item.serviceName}</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-neutral-500">Cantidad</dt>
          <dd className="font-medium text-black">
            {item.quantity} {item.unit}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-neutral-500">Horas</dt>
          <dd className="font-medium text-black">{item.hours} h</dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-neutral-500">Costo unitario</dt>
          <dd className="font-medium text-black">{formatUSD(item.unitCost)}</dd>
        </div>
      </dl>
      <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-neutral-200 pt-3">
        <span className="text-xs text-neutral-500">Subtotal / {periodLabel}</span>
        <span className="text-xl font-bold text-black">{formatUSD(subtotal)}</span>
      </div>
    </div>
  )
}
