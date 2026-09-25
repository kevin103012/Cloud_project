import { Link } from 'react-router'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 text-center text-foreground">
      <div><p className="text-sm font-semibold text-brand-600">404</p><h1 className="mt-2 text-4xl font-bold">Página no encontrada</h1><p className="mt-3 text-muted">La ruta solicitada no existe en CloudOpus.</p><Link to="/" className="mt-6 inline-flex rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">Volver al inicio</Link></div>
    </main>
  )
}
