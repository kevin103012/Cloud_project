import { Activity, CheckCircle2, Globe2, MapPin, Server } from 'lucide-react'
import RegionCard from '../components/RegionCard'
import StatusBadge from '../components/StatusBadge'
import WorldMap from '../components/WorldMap'
import { useProposals } from '../hooks/useProposals'
import { regions } from '../data/regions'
import { countServicesInRegion, getValidServicesForProposal } from '../utils/cloudData'

export default function Infrastructure() {
  const { proposals, selectedProposalId, setSelectedProposalId } = useProposals()
  const selectedProposal = proposals.find((proposal) => proposal.id === selectedProposalId) ?? proposals[0]
  const selectedRegion = regions.find((region) => region.id === selectedProposal?.regionId)
  const deployedServices = selectedProposal ? getValidServicesForProposal(selectedProposal) : []

  const servicesInRegion = new Map(
    regions.map((region) => [
      region.id,
      countServicesInRegion(proposals, region.id),
    ]),
  )

  if (!selectedProposal || !selectedRegion) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
        <p className="font-semibold text-black">No hay propuestas disponibles</p>
        <p className="mt-1 text-sm text-neutral-500">Registra una propuesta en Planificación para visualizar su infraestructura.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-neutral-400 uppercase">Cloud architecture</p>
          <h1 className="text-3xl font-bold text-black">Infraestructura global</h1>
          <p className="mt-1 text-sm text-neutral-500">Visualiza dónde se desplegará cada propuesta Cloud.</p>
        </div>
        <div className="w-full md:w-80">
          <label className="mb-1 block text-xs font-semibold text-neutral-500" htmlFor="infrastructure-proposal">
            Propuesta seleccionada
          </label>
          <select
            id="infrastructure-proposal"
            value={selectedProposal.id}
            onChange={(event) => setSelectedProposalId(event.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-black shadow-sm outline-none focus:border-black focus:ring-2 focus:ring-neutral-200"
          >
            {proposals.map((proposal) => (
              <option key={proposal.id} value={proposal.id}>{proposal.solutionName}</option>
            ))}
          </select>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="rounded-lg bg-black p-2 text-white"><Globe2 className="h-5 w-5" /></span><span className="text-xs font-medium text-neutral-400">Región principal</span></div>
          <p className="mt-3 truncate text-lg font-bold text-black" title={selectedRegion.name}>{selectedRegion.name}</p>
          <p className="mt-1 text-sm text-neutral-500">{selectedRegion.location}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="rounded-lg bg-green-100 p-2 text-green-700"><CheckCircle2 className="h-5 w-5" /></span><span className="text-xs font-medium text-neutral-400">Estado regional</span></div>
          <p className="mt-3 text-lg font-bold text-black">{selectedRegion.status === 'active' ? 'Activa' : 'Standby'}</p>
          <p className="mt-1 text-sm text-neutral-500">Región asignada a la propuesta</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="rounded-lg bg-neutral-100 p-2 text-black"><Server className="h-5 w-5" /></span><span className="text-xs font-medium text-neutral-400">Servicios</span></div>
          <p className="mt-3 text-lg font-bold text-black">{deployedServices.length} desplegados</p>
          <p className="mt-1 text-sm text-neutral-500">Definidos en la propuesta</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="rounded-lg bg-amber-100 p-2 text-amber-700"><Activity className="h-5 w-5" /></span><span className="text-xs font-medium text-neutral-400">Disponibilidad</span></div>
          <p className="mt-3 text-lg font-bold text-black">{selectedProposal.availability}</p>
          <p className="mt-1 text-sm text-neutral-500">Objetivo de la arquitectura</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="text-lg font-semibold text-black">Mapa de regiones AWS</h2><p className="mt-1 text-xs text-neutral-500">La región resaltada corresponde a la propuesta seleccionada.</p></div>
            <StatusBadge status={selectedRegion.status === 'active' ? 'ok' : 'warning'} label={selectedRegion.status === 'active' ? 'Región activa' : 'Región standby'} />
          </div>
          <WorldMap
            selectedRegionId={selectedRegion.id}
            availableRegionIds={[...new Set(proposals.map((proposal) => proposal.regionId))]}
            onSelect={(regionId) => {
              const proposal = proposals.find((item) => item.regionId === regionId)
              if (proposal) setSelectedProposalId(proposal.id)
            }}
          />
        </div>

        <div className="rounded-2xl border border-black bg-black p-6 text-white shadow-sm">
          <p className="text-xs font-semibold tracking-[0.16em] text-neutral-400 uppercase">Deployment target</p>
          <h2 className="mt-2 text-2xl font-bold">{selectedProposal.solutionName}</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-300">{selectedProposal.description}</p>
          <div className="mt-6 border-t border-neutral-700 pt-5">
            <p className="text-xs font-semibold text-neutral-400 uppercase">Ubicación de despliegue</p>
            <div className="mt-3 flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-neutral-300" /><div><p className="font-semibold">{selectedRegion.name}</p><p className="text-sm text-neutral-300">{selectedRegion.location}</p></div></div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-sm text-neutral-300"><CheckCircle2 className="h-4 w-4" />{deployedServices.length} servicios asociados a esta propuesta</div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3"><div><h2 className="text-lg font-semibold text-black">Regiones disponibles</h2><p className="text-xs text-neutral-500">Contexto global de las regiones configuradas en los mocks.</p></div><span className="text-xs font-medium text-neutral-400">{regions.length} regiones</span></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {regions.map((region) => {
            const proposal = proposals.find((item) => item.regionId === region.id)
            return (
              <RegionCard
                key={region.id}
                region={region}
                selected={region.id === selectedRegion.id}
                deployedServiceCount={servicesInRegion.get(region.id)}
                onSelect={proposal ? () => setSelectedProposalId(proposal.id) : undefined}
              />
            )
          })}
        </div>
      </section>

      <section>
        <div className="mb-3"><h2 className="text-lg font-semibold text-black">Servicios desplegados</h2><p className="text-xs text-neutral-500">Servicios definidos para {selectedProposal.solutionName} en {selectedRegion.name}.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {deployedServices.map((service) => <article key={service.id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="rounded-lg bg-neutral-100 p-2 text-black"><Server className="h-4 w-4" /></div><StatusBadge status="ok" label="Desplegado" /></div><h3 className="mt-4 font-semibold text-black">{service.name}</h3><p className="mt-1 text-xs font-medium text-neutral-500">{service.category}</p><p className="mt-3 text-sm leading-5 text-neutral-500">{service.mainFunction}</p></article>)}
        </div>
      </section>
    </div>
  )
}
