import { ArrowLeft, Cloud, LineChart, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'

const principles = [
  { title: 'Visibilidad', text: 'Centralizamos costos, servicios y regiones de cada propuesta.', icon: LineChart },
  { title: 'Seguridad', text: 'Relacionamos controles con los servicios realmente seleccionados.', icon: ShieldCheck },
  { title: 'Planificación', text: 'Facilitamos decisiones antes de desplegar recursos en AWS.', icon: Cloud },
]

export default function SobreNosotros() {
  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-foreground">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"><ArrowLeft className="h-4 w-4" />Volver al inicio</Link>
        <p className="mt-14 text-xs font-semibold tracking-[0.16em] text-muted uppercase">CloudOpus</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-bold">Decisiones cloud más claras antes del despliegue.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">CloudOpus es un prototipo para centralizar la planificación de soluciones AWS y presentar información técnica de manera comprensible.</p>
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {principles.map(({ title, text, icon: Icon }) => <article key={title} className="rounded-2xl border border-subtle bg-surface p-6 shadow-sm"><Icon className="h-6 w-6 text-brand-600" /><h2 className="mt-4 text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted">{text}</p></article>)}
        </section>
      </div>
    </main>
  )
}
