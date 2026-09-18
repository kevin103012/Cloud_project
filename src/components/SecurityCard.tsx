import type { SecurityCheck } from '../types/cloud'
import StatusBadge from './StatusBadge'

interface SecurityCardProps {
  check: SecurityCheck
}

export default function SecurityCard({ check }: SecurityCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-black">{check.title}</p>
        <StatusBadge status={check.status} />
      </div>
      <p className="mt-1 text-xs text-neutral-500">{check.area}</p>
      <p className="mt-2 text-sm text-neutral-600">{check.description}</p>
    </div>
  )
}
