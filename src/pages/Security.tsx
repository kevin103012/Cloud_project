import { AlertTriangle, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react'
import SecurityCard from '../components/SecurityCard'
import StatCard from '../components/StatCard'
import { useProposals } from '../hooks/useProposals'
import { responsibilityItems } from '../data/security'
import { getSecurityChecksForProposal, summarizeSecurity } from '../utils/cloudData'

export default function Security() {
  const { proposals, selectedProposalId, setSelectedProposalId } = useProposals()
  const selected = proposals.find((proposal) => proposal.id === selectedProposalId) ?? proposals[0]
  const checks = getSecurityChecksForProposal(selected)
  const summary = summarizeSecurity(checks)
  const score = checks.length === 0
    ? 0
    : Math.round(((summary.ok + summary.warning * 0.5) / checks.length) * 100)

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
        <h2 className="text-lg font-semibold text-black">Responsabilidad compartida</h2>
        <p className="mt-1 text-xs text-neutral-500">Distribución de responsabilidades entre AWS y el cliente.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {responsibilityItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-neutral-100 px-4 py-3">
              <span className="text-sm text-neutral-700">{item.task}</span>
              <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-black">{item.owner}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
