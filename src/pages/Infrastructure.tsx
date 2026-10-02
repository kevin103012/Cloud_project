import { Activity, ArrowRight, CheckCircle2, Crown, Globe2, MapPin, Server } from 'lucide-react'
import RegionCard from '../components/RegionCard'
import StatusBadge from '../components/StatusBadge'
import WorldMap from '../components/WorldMap'
import { useProposals } from '../hooks/useProposals'
import { regions } from '../data/regions'
import { countServicesInRegion, getProposalRegionIds, getValidServicesForProposal } from '../utils/cloudData'
import { haversineKm } from '../utils/geo'

/** Latencia aproximada de ida y vuelta por fibra (~100 km por ms). Solo con fines de planificación. */
function estimateLatencyMs(distanceKm: number): number {
  return Math.max(1, Math.round(distanceKm / 100))
}

export default function Infrastructure() {
  const { proposals, selectedProposalId, setSelectedProposalId } = useProposals()
  const selectedProposal = proposals.find((proposal) => proposal.id === selectedProposalId) ?? proposals[0]
  const selectedRegion = regions.find((region) => region.id === selectedProposal?.regionId)
  const deployedServices = selectedProposal ? getValidServicesForProposal(selectedProposal) : []
  const planRegionIds = getProposalRegionIds(selectedProposal)
  const replicaIds = selectedProposal?.secondaryRegionIds ?? []
  const planRegions = planRegionIds.flatMap((id) => {
    const region = regions.find((item) => item.id === id)
    return region ? [region] : []
  })
  const replicaLinks = replicaIds.flatMap((id, index) => {
    const replica = regions.find((item) => item.id === id)
    if (!replica || !selectedRegion) return []
    const distanceKm = haversineKm(selectedRegion.lat, selectedRegion.lng, replica.lat, replica.lng)
    return [{ index, replica, distanceKm, latencyMs: estimateLatencyMs(distanceKm) }]
  })
  const allPlanRegionIds = [...new Set(proposals.flatMap((proposal) => getProposalRegionIds(proposal)))]

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
    <div className="flex min-w-0 flex-col gap-6 overflow-hidden">
      <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-neutral-400 uppercase">Cloud architecture</p>
          <h1 className="text-2xl font-bold break-words text-black sm:text-3xl">Infraestructura global</h1>
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

      <section className="grid min-w-0 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0"><h2 className="text-lg font-semibold text-black">Mapa de regiones AWS</h2><p className="mt-1 text-xs text-neutral-500">El servidor principal y sus réplicas corresponden a la planificación seleccionada. Las líneas muestran la replicación principal → réplica.</p></div>
            <StatusBadge status={selectedRegion.status === 'active' ? 'ok' : 'warning'} label={selectedRegion.status === 'active' ? 'Región activa' : 'Región standby'} />
          </div>
          <WorldMap
            selectedRegionId={selectedRegion.id}
            availableRegionIds={allPlanRegionIds}
            primaryRegionId={selectedRegion.id}
            replicaRegionIds={replicaIds}
            onSelect={(regionId) => {
              const proposal = proposals.find((item) => getProposalRegionIds(item).includes(regionId))
              if (proposal) setSelectedProposalId(proposal.id)
            }}
          />
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-black bg-black p-6 text-white shadow-sm">
          <p className="text-xs font-semibold tracking-[0.16em] text-neutral-400 uppercase">Deployment target</p>
          <h2 className="mt-2 text-2xl font-bold break-words">{selectedProposal.solutionName}</h2>
          <p className="mt-2 text-sm leading-6 break-words text-neutral-300">{selectedProposal.description}</p>
          <div className="mt-6 border-t border-neutral-700 pt-5">
            <p className="text-xs font-semibold text-neutral-400 uppercase">Servidor principal</p>
            <div className="mt-3 flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-neutral-300" /><div className="min-w-0"><p className="font-semibold">{selectedRegion.name}</p><p className="text-sm text-neutral-300">{selectedRegion.location}</p></div></div>
          </div>
          {planRegions.length > 1 && (
            <div className="mt-5 border-t border-neutral-700 pt-5">
              <p className="text-xs font-semibold text-neutral-400 uppercase">Réplicas ({replicaIds.length})</p>
              <ul className="mt-3 space-y-2">
                {replicaLinks.map(({ index, replica }) => (
                  <li key={replica.id} className="flex items-start gap-2 text-sm text-neutral-300">
                    <Server className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                    <span className="min-w-0"><span className="font-semibold text-white">Réplica {index + 1}:</span> {replica.name} · {replica.location}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-5 flex items-center gap-2 text-sm text-neutral-300"><CheckCircle2 className="h-4 w-4 shrink-0" />{deployedServices.length} servicios asociados a esta propuesta</div>
        </div>
      </section>

      <section className="min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-black">Servidores de la planificación</h2>
            <p className="text-xs text-neutral-500">
              {planRegions.length} servidor{planRegions.length > 1 ? 'es' : ''} en {selectedProposal.solutionName}: 1 principal
              {replicaIds.length > 0 && <> y {replicaIds.length} réplica{replicaIds.length > 1 ? 's' : ''}</>}.
              La estimación de costos considera la región principal.
            </p>
          </div>
          <span className="shrink-0 text-xs font-medium text-neutral-400">{planRegions.length} nodos</span>
        </div>
        <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {planRegions.map((region) => {
            const isPrimary = region.id === selectedRegion.id
            const replicaIndex = replicaIds.indexOf(region.id)
            const distanceKm = isPrimary || !selectedRegion
              ? 0
              : haversineKm(selectedRegion.lat, selectedRegion.lng, region.lat, region.lng)
            return (
              <article
                key={region.id}
                className={`min-w-0 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm ${isPrimary ? 'border-amber-400 ring-2 ring-amber-100' : 'border-blue-200'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`rounded-lg p-2 ${isPrimary ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {isPrimary ? <Crown className="h-5 w-5" /> : <Server className="h-5 w-5" />}
                  </span>
                  <StatusBadge status={isPrimary ? 'warning' : 'ok'} label={isPrimary ? 'Principal' : `Réplica ${replicaIndex + 1}`} />
                </div>
                <h3 className="mt-3 truncate text-base font-bold text-black" title={region.name}>{region.name}</h3>
                <p className="mt-1 text-xs text-neutral-500">{region.location} · {region.id}</p>
                <dl className="mt-3 space-y-1.5 border-t border-neutral-100 pt-3 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-neutral-400">Distancia al principal</dt>
                    <dd className="font-semibold text-black">{isPrimary ? '—' : `${Math.round(distanceKm).toLocaleString('es-ES')} km`}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-neutral-400">Factor de precio</dt>
                    <dd className="font-semibold text-black">×{region.priceFactor.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-neutral-400">Servicios</dt>
                    <dd className="font-semibold text-black">{deployedServices.length} replicados</dd>
                  </div>
                </dl>
              </article>
            )
          })}
        </div>

        {replicaLinks.length > 0 ? (
          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <h3 className="text-sm font-semibold text-black">Conexiones principal → réplica</h3>
            <p className="mt-0.5 text-xs text-neutral-500">Distancias y latencias estimadas con fines de planificación.</p>
            <ul className="mt-3 space-y-2">
              {replicaLinks.map(({ index, replica, distanceKm, latencyMs }) => (
                <li
                  key={replica.id}
                  className="flex flex-col gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm sm:flex-row sm:items-center sm:gap-2"
                >
                  <span className="min-w-0 flex-1 truncate font-medium text-black">
                    {selectedRegion.name}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 rotate-90 text-neutral-400 sm:rotate-0" />
                  <span className="min-w-0 flex-1 truncate font-medium text-black">
                    {replica.name} <span className="font-normal text-neutral-500">(réplica {index + 1})</span>
                  </span>
                  <span className="shrink-0 text-xs text-neutral-500">
                    ≈ {Math.round(distanceKm).toLocaleString('es-ES')} km · ≈ {latencyMs} ms
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
            Esta planificación usa un solo servidor. Añade réplicas desde Planificación → Registrar para visualizar aquí sus conexiones.
          </p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3"><div><h2 className="text-lg font-semibold text-black">Regiones disponibles</h2><p className="text-xs text-neutral-500">Contexto global de las regiones configuradas en los mocks.</p></div><span className="text-xs font-medium text-neutral-400">{regions.length} regiones</span></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {regions.map((region) => {
            const proposal = proposals.find((item) => getProposalRegionIds(item).includes(region.id))
            return (
              <RegionCard
                key={region.id}
                region={region}
                selected={planRegionIds.includes(region.id)}
                deployedServiceCount={servicesInRegion.get(region.id)}
                onSelect={proposal ? () => setSelectedProposalId(proposal.id) : undefined}
              />
            )
          })}
        </div>
      </section>

      <section>
        <div className="mb-3"><h2 className="text-lg font-semibold text-black">Servicios desplegados</h2><p className="text-xs text-neutral-500">Servicios definidos para {selectedProposal.solutionName} en {selectedRegion.name}{replicaIds.length > 0 ? ` y replicados en ${replicaIds.length} servidor${replicaIds.length > 1 ? 'es' : ''}` : ''}.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {deployedServices.map((service) => <article key={service.id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="rounded-lg bg-neutral-100 p-2 text-black"><Server className="h-4 w-4" /></div><StatusBadge status="ok" label="Desplegado" /></div><h3 className="mt-4 font-semibold text-black">{service.name}</h3><p className="mt-1 text-xs font-medium text-neutral-500">{service.category}</p><p className="mt-3 text-sm leading-5 text-neutral-500">{service.mainFunction}</p></article>)}
        </div>
      </section>
    </div>
  )
}
