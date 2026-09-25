import type { StatusLevel } from '../types/cloud'

const styles: Record<StatusLevel, string> = {
  ok: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  error: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
}

const dots: Record<StatusLevel, string> = {
  ok: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-rose-500',
}

const defaultLabels: Record<StatusLevel, string> = {
  ok: 'Correcto',
  warning: 'Requiere revisión',
  error: 'Problema',
}

interface StatusBadgeProps {
  status: StatusLevel
  label?: string
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {label ?? defaultLabels[status]}
    </span>
  )
}
