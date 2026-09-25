import { ArrowDown, ArrowRight, CheckCircle2, CircleOff, Network as NetworkIcon } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { networkEdges, networkNodes } from '../data/network'
import { useProposals } from '../hooks/useProposals'
import type { NetworkNode } from '../types/cloud'

interface NodeCardProps {
  node: NetworkNode
  enabled: boolean
}

function NodeCard({ node, enabled }: NodeCardProps) {
  return (
    <article className={`min-w-40 flex-1 rounded-xl border p-4 ${enabled ? 'border-neutral-200 bg-white' : 'border-dashed border-neutral-300 bg-neutral-100 opacity-60'}`}>
      <div className="flex items-start justify-between gap-2">
        {enabled ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <CircleOff className="h-5 w-5 text-neutral-400" />}
        <StatusBadge status={enabled ? node.status : 'warning'} label={enabled ? 'Incluido' : 'No incluido'} />
      </div>
      <h3 className="mt-3 font-semibold text-black">{node.label}</h3>
      <p className="mt-1 text-xs leading-5 text-neutral-500">{node.description}</p>
    </article>
  )
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-1 py-1 text-xs text-neutral-400 xl:w-20 xl:flex-col">
      <span>{label}</span>
      <ArrowDown className="h-4 w-4 xl:hidden" />
      <ArrowRight className="hidden h-4 w-4 xl:block" />
    </div>
  )
}

export default function Network() {
  const { proposals, selectedProposalId, setSelectedProposalId } = useProposals()
  const selected = proposals.find((proposal) => proposal.id === selectedProposalId) ?? proposals[0]

  if (!selected) return <p className="text-sm text-neutral-500">Registra una propuesta para visualizar su red.</p>

  const enabledIds = new Set(
    networkNodes
      .filter((node) => !node.serviceId || selected.serviceIds.includes(node.serviceId))
      .map((node) => node.id),
  )
  const node = (id: string) => networkNodes.find((item) => item.id === id)!
  const edgeLabel = (from: string, to: string) =>
    networkEdges.find((edge) => edge.from === from && edge.to === to)?.label ?? ''

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-neutral-400 uppercase">Network topology</p>
          <h1 className="text-3xl font-bold text-black">Arquitectura de Red</h1>
          <p className="mt-1 text-sm text-neutral-500">Internet, distribución global y recursos internos de la VPC.</p>
        </div>
        <div className="w-full md:w-80">
          <label className="mb-1 block text-xs font-semibold text-neutral-500" htmlFor="network-proposal">Propuesta seleccionada</label>
          <select id="network-proposal" value={selected.id} onChange={(event) => setSelectedProposalId(event.target.value)} className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-black shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-neutral-200">
            {proposals.map((proposal) => <option key={proposal.id} value={proposal.id}>{proposal.solutionName}</option>)}
          </select>
        </div>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div><h2 className="text-lg font-semibold text-black">Flujo de red</h2><p className="text-xs text-neutral-500">Los componentes atenuados no están incluidos en la propuesta, pero conservan la arquitectura de referencia.</p></div>
          <NetworkIcon className="h-5 w-5 text-neutral-500" />
        </div>

        <div className="mt-6 flex flex-col items-stretch xl:flex-row xl:items-center">
          <NodeCard node={node('internet')} enabled={enabledIds.has('internet')} />
          <Connector label={edgeLabel('internet', 'route53')} />
          <NodeCard node={node('route53')} enabled={enabledIds.has('route53')} />
          <Connector label={edgeLabel('route53', 'cloudfront')} />
          <NodeCard node={node('cloudfront')} enabled={enabledIds.has('cloudfront')} />
          <Connector label={edgeLabel('cloudfront', 'vpc')} />

          <article className={`min-w-80 flex-[2] rounded-2xl border-2 p-4 ${enabledIds.has('vpc') ? 'border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/20' : 'border-dashed border-neutral-300 bg-neutral-100 opacity-70'}`}>
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-xs font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">Amazon VPC</p><h3 className="mt-1 font-semibold text-black">{node('vpc').label}</h3><p className="mt-1 text-xs text-neutral-500">{node('vpc').description}</p></div>
              <StatusBadge status={enabledIds.has('vpc') ? 'ok' : 'warning'} label={enabledIds.has('vpc') ? 'Incluida' : 'No incluida'} />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="rounded-xl border border-neutral-200 bg-surface p-3"><p className="mb-2 text-[11px] font-semibold text-neutral-400 uppercase">Subred pública</p><NodeCard node={node('ec2')} enabled={enabledIds.has('ec2')} /></div>
              <div className="flex flex-col items-center gap-1 text-xs text-neutral-400"><span>{edgeLabel('ec2', 'rds')}</span><ArrowDown className="h-4 w-4 md:hidden" /><ArrowRight className="hidden h-4 w-4 md:block" /></div>
              <div className="rounded-xl border border-neutral-200 bg-surface p-3"><p className="mb-2 text-[11px] font-semibold text-neutral-400 uppercase">Subred privada</p><NodeCard node={node('rds')} enabled={enabledIds.has('rds')} /></div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
