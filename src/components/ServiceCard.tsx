import type { CloudService } from '../types/cloud'
import { formatUSD } from '../utils/format'
import { getServiceCost } from '../utils/cloudData'

interface ServiceCardProps {
  service: CloudService
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const monthlyCost = getServiceCost(service.id)?.monthlyCost
  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-black">{service.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            service.status === 'active'
              ? 'bg-black text-white'
              : 'border border-neutral-300 text-neutral-500'
          }`}
        >
          {service.status === 'active' ? 'En uso' : 'Sin uso'}
        </span>
      </div>
      <p className="mt-0.5 text-xs font-medium tracking-wide text-neutral-400 uppercase">
        {service.category}
      </p>
      <p className="mt-3 text-xs font-semibold text-neutral-400 uppercase">Función principal</p>
      <p className="mt-1 text-sm font-medium leading-5 text-black">{service.mainFunction}</p>
      <p className="mt-3 text-xs font-semibold text-neutral-400 uppercase">Descripción</p>
      <p className="mt-1 text-sm leading-6 text-neutral-600">
        {service.description}
      </p>
      <p className="mt-3 text-xs text-neutral-400">
        {monthlyCost === undefined ? 'Sin estimación de costo' : `≈ ${formatUSD(monthlyCost)}/mes`}
      </p>
    </div>
  )
}
