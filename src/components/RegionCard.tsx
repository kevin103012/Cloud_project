import { CheckCircle2, MapPin, Server } from 'lucide-react'
import type { Region } from '../types/cloud'

interface RegionCardProps {
  region: Region
  selected?: boolean
  deployedServiceCount?: number
  onSelect?: () => void
}

export default function RegionCard({
  region,
  selected = false,
  deployedServiceCount = 0,
  onSelect,
}: RegionCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className={`rounded-xl p-2 ${selected ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'}`}>
            <MapPin className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-black">{region.name}</h3>
            <p className="mt-1 text-xs text-neutral-500">{region.location}</p>
          </div>
        </div>
        <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${region.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          <CheckCircle2 className="h-3.5 w-3.5" />
          {region.status === 'active' ? 'Activa' : 'Standby'}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs">
        <span className="flex items-center gap-1.5 text-neutral-500">
          <Server className="h-3.5 w-3.5" />
          {deployedServiceCount} servicios desplegados
        </span>
        <span className="font-medium text-neutral-400">{region.id}</span>
      </div>
    </>
  )

  if (!onSelect) {
    return <article className={`rounded-2xl border bg-white p-5 shadow-sm ${selected ? 'border-black ring-2 ring-neutral-200' : 'border-neutral-200'}`}>{content}</article>
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${selected ? 'border-black ring-2 ring-neutral-200' : 'border-neutral-200'}`}
    >
      {content}
    </button>
  )
}
