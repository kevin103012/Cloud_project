import { ArrowLeft, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router'

export default function Contacto() {
  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-foreground">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"><ArrowLeft className="h-4 w-4" />Volver al inicio</Link>
        <section className="mt-14 rounded-2xl border border-subtle bg-surface p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">Contacto</p>
          <h1 className="mt-2 text-4xl font-bold">Conversemos sobre tu arquitectura cloud.</h1>
          <p className="mt-4 text-muted">Canales de demostración para consultas relacionadas con CloudOpus.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-surface-muted p-5"><Mail className="h-5 w-5 text-brand-600" /><p className="mt-3 text-sm font-semibold">Correo</p><p className="mt-1 text-sm text-muted">contacto@cloudopus.example</p></div>
            <div className="rounded-xl bg-surface-muted p-5"><MapPin className="h-5 w-5 text-brand-600" /><p className="mt-3 text-sm font-semibold">Ubicación</p><p className="mt-1 text-sm text-muted">Lima, Perú</p></div>
          </div>
        </section>
      </div>
    </main>
  )
}
