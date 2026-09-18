import type { CloudService } from '../types/cloud'
import { formatUSD } from '../utils/format'

interface ServiceCardProps {
  service: CloudService
}

export default function ServiceCard({ service }: ServiceCardProps) {
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
      <p className="mt-2 text-sm font-medium text-black">{service.mainFunction}</p>
      <p className="mt-2 text-sm text-neutral-600 transition-all duration-200 md:mt-0 md:max-h-0 md:overflow-hidden md:opacity-0 md:group-hover:mt-2 md:group-hover:max-h-32 md:group-hover:opacity-100">
        {service.description}
      </p>
      <p className="mt-3 text-xs text-neutral-400">
        ≈ {formatUSD(service.monthlyCost)}/mes
      </p>
    </div>
  )
}
