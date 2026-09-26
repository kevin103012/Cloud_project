import { AlertTriangle, CheckCircle2, Cloud, Share2, ShieldCheck, Users, XCircle } from 'lucide-react'
import SecurityCard from '../components/SecurityCard'
import StatCard from '../components/StatCard'
import { useProposals } from '../hooks/useProposals'
import { responsibilityItems } from '../data/security'
import { getSecurityChecksForProposal, summarizeSecurity } from '../utils/cloudData'
import type { Owner } from '../types/cloud'

const ownerColumns: { owner: Owner; title: string; subtitle: string; icon: typeof Cloud }[] = [
  { owner: 'AWS', title: 'AWS — de la nube', subtitle: 'Infraestructura física y virtual', icon: Cloud },
  { owner: 'Cliente', title: 'Cliente — en la nube', subtitle: 'Datos, aplicaciones y accesos', icon: Users },
  { owner: 'Compartido', title: 'Compartido', subtitle: 'Configuración y controles conjuntos', icon: Share2 },
]

export default function Security() {
  const { proposals, selectedProposalId, setSelectedProposalId } = useProposals()
  const selected = proposals.find((proposal) => proposal.id === selectedProposalId) ?? proposals[0]
  const checks = getSecurityChecksForProposal(selected)
  const summary = summarizeSecurity(checks)
  const score = checks.length === 0
    ? 0
    : Math.round(((summary.ok + summary.warning * 0.5) / checks.length) * 100)
  const grouped = ownerColumns.map((column) => ({
    ...column,
    items: responsibilityItems.filter((item) => item.owner === column.owner),
  }))

  if (!selected) {
    return <p className="text-sm text-neutral-500">Registra una propuesta para evaluar su seguridad.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-neutral-400 uppercase">Security posture</p>
          <h1 className="text-3xl font-bold text-black">Seguridad</h1>
          <p className="mt-1 text-sm text-neutral-500">Controles aplicables a los servicios de la propuesta.</p>
        </div>
        <div className="w-full md:w-80">
          <label className="mb-1 block text-xs font-semibold text-neutral-500" htmlFor="security-proposal">Propuesta seleccionada</label>
          <select id="security-proposal" value={selected.id} onChange={(event) => setSelectedProposalId(event.target.value)} className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-black shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-neutral-200">
            {proposals.map((proposal) => <option key={proposal.id} value={proposal.id}>{proposal.solutionName}</option>)}
          </select>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Puntuación" value={`${score}%`} subtitle="Advertencias ponderadas al 50%" icon={ShieldCheck} inverted />
        <StatCard title="Correctos" value={String(summary.ok)} subtitle={`${checks.length} controles aplicables`} icon={CheckCircle2} />
        <StatCard title="En revisión" value={String(summary.warning)} subtitle="Requieren seguimiento" icon={AlertTriangle} />
        <StatCard title="Problemas" value={String(summary.error)} subtitle="Requieren corrección" icon={XCircle} />
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-black">Controles de seguridad</h2>
          <p className="text-xs text-neutral-500">Los controles de S3, RDS y red solo aparecen cuando esos servicios forman parte de la propuesta.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {checks.map((check) => <SecurityCard key={check.id} check={check} />)}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Modelo de responsabilidad compartida</h2>
        <p className="mt-1 text-xs text-neutral-500">
          AWS protege la seguridad <span className="font-semibold text-black">de</span> la nube; el
          cliente protege la seguridad <span className="font-semibold text-black">en</span> la nube.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {grouped.map(({ owner, title, subtitle, icon: Icon, items }) => (
            <div key={owner} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-white p-1.5 text-black"><Icon className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-bold text-black">{title}</p>
                  <p className="text-xs text-neutral-500">{subtitle}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2.5">
                {items.map((item) => (
                  <li key={item.id} className="rounded-lg bg-white px-3 py-2">
                    <p className="text-sm font-medium text-neutral-700">{item.task}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">{item.layer}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
