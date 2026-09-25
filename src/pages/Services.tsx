import { Boxes, MapPin, Wallet } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { useProposals } from '../hooks/useProposals'
import { awsServices } from '../data/awsServices'
import { regions } from '../data/regions'
import { formatUSD } from '../utils/format'
import { getServiceCost } from '../utils/cloudData'

export default function Services() {
  const { proposals, selectedProposalId, setSelectedProposalId } = useProposals()
  const selected = proposals.find((proposal) => proposal.id === selectedProposalId) ?? proposals[0]

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div><p className="mb-1 text-xs font-semibold tracking-[0.16em] text-neutral-400 uppercase">Service catalog</p><h1 className="text-3xl font-bold text-black">Servicios AWS</h1><p className="mt-1 text-sm text-neutral-500">Catálogo, costos y estado de utilización por propuesta.</p></div>
        {selected && <div className="w-full md:w-80"><label className="mb-1 block text-xs font-semibold text-neutral-500" htmlFor="services-proposal">Propuesta seleccionada</label><select id="services-proposal" value={selected.id} onChange={(event) => setSelectedProposalId(event.target.value)} className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-black shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-neutral-200">{proposals.map((proposal) => <option key={proposal.id} value={proposal.id}>{proposal.solutionName}</option>)}</select></div>}
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {awsServices.map((service) => {
          const cost = getServiceCost(service.id)
          const used = selected?.serviceIds.includes(service.id) ?? false
          const availableRegions = regions.filter((region) => region.services.includes(service.id))
          return (
            <article key={service.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${used ? 'border-black ring-2 ring-neutral-200' : 'border-neutral-200'}`}>
              <div className="flex items-start justify-between gap-3"><span className="rounded-lg bg-neutral-100 p-2 text-black"><Boxes className="h-5 w-5" /></span><StatusBadge status={used ? 'ok' : 'warning'} label={used ? 'En la propuesta' : 'No seleccionado'} /></div>
              <h2 className="mt-4 text-lg font-semibold text-black">{service.name}</h2>
              <p className="text-xs font-medium tracking-wide text-neutral-400 uppercase">{service.category}</p>
              <p className="mt-3 text-xs font-semibold tracking-wide text-neutral-400 uppercase">Función principal</p>
              <p className="mt-1 text-sm font-medium leading-6 text-black">{service.mainFunction}</p>
              <p className="mt-3 text-xs font-semibold tracking-wide text-neutral-400 uppercase">Descripción</p>
              <p className="mt-1 text-sm leading-6 text-neutral-600">{service.description}</p>
              <div className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
                <p className="flex items-center gap-2"><Wallet className="h-4 w-4" />{cost ? `${formatUSD(cost.monthlyCost)} estimados al mes` : 'Sin costo configurado'}</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{availableRegions.length} regiones configuradas</p>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
