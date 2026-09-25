import { Cloud } from 'lucide-react'

interface LoaderProps {
  size?: number
}

export default function Loader({ size = 128 }: LoaderProps) {
  return (
    <div
      className="relative flex items-center justify-center text-brand-600"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Cargando"
    >
      <span className="absolute inset-0 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600" />
      <Cloud className="animate-pulse" style={{ width: size * 0.42, height: size * 0.42 }} aria-hidden="true" />
    </div>
  )
}
