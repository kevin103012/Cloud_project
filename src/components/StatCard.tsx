import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  inverted?: boolean
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  inverted = false,
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        inverted
          ? 'border-black bg-black text-white'
          : 'border-neutral-200 bg-white text-black'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className={`text-sm font-medium ${
            inverted ? 'text-neutral-300' : 'text-neutral-500'
          }`}
        >
          {title}
        </p>
        <span
          className={`rounded-lg p-2 ${
            inverted ? 'bg-white text-black' : 'bg-black text-white'
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-2 truncate text-2xl font-bold" title={value}>
        {value}
      </p>
      {subtitle && (
        <p
          className={`mt-1 truncate text-xs ${
            inverted ? 'text-neutral-300' : 'text-neutral-500'
          }`}
          title={subtitle}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
