import { Activity, CheckCircle2, Globe2, MapPin, Server } from 'lucide-react'
import { useMemo, useState } from 'react'
import RegionCard from '../components/RegionCard'
import StatusBadge from '../components/StatusBadge'
import { useProposals } from '../context/ProposalsContext'
import { awsServices } from '../data/awsServices'
import { regions } from '../data/regions'

const markerPositions: Record<string, { left: string; top: string }> = {
  'us-west-2': { left: '17%', top: '35%' },
  'us-east-1': { left: '29%', top: '31%' },
  'sa-east-1': { left: '38%', top: '66%' },
  'eu-west-1': { left: '50%', top: '28%' },
}

export default function Infrastructure() {
  const { proposals } = useProposals()
  const [selectedId, setSelectedId] = useState(proposals[0]?.id ?? '')
  const selectedProposal = proposals.find((proposal) => proposal.id === selectedId) ?? proposals[0]
  const selectedRegion = regions.find((region) => region.id === selectedProposal?.regionId) ?? regions[0]

  const deployedServices = useMemo(
    () => awsServices.filter((service) => selectedProposal?.serviceIds.includes(service.id)),
    [selectedProposal],
  )

  const servicesInRegion = new Map(
    regions.map((region) => [
      region.id,
      selectedProposal?.regionId === region.id ? deployedServices.length : 0,
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
            onChange={(event) => setSelectedId(event.target.value)}
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
          <div className="relative mt-5 min-h-[340px] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
            <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
            <div className="absolute left-[8%] top-[20%] h-[36%] w-[25%] rotate-[-10deg] rounded-[45%] bg-white/80" />
            <div className="absolute left-[32%] top-[48%] h-[38%] w-[16%] rotate-[18deg] rounded-[48%] bg-white/80" />
            <div className="absolute left-[47%] top-[15%] h-[24%] w-[30%] rotate-[8deg] rounded-[48%] bg-white/80" />
            <div className="absolute left-[70%] top-[43%] h-[30%] w-[22%] rotate-[-12deg] rounded-[48%] bg-white/80" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M29 31 C36 27, 43 27, 50 28" fill="none" stroke="#a3a3a3" strokeDasharray="1.5 1.5" strokeWidth="0.7" />
              <path d="M29 31 C31 44, 35 56, 38 66" fill="none" stroke="#a3a3a3" strokeDasharray="1.5 1.5" strokeWidth="0.7" />
              <path d="M17 35 C21 32, 25 31, 29 31" fill="none" stroke="#a3a3a3" strokeDasharray="1.5 1.5" strokeWidth="0.7" />
            </svg>
            {regions.map((region) => {
              const position = markerPositions[region.id] ?? { left: '50%', top: '50%' }
              const active = region.id === selectedRegion.id
              return (
                <button
                  key={region.id}
                  type="button"
                  title={`${region.name} · ${region.location}`}
                  onClick={() => {
                    const proposal = proposals.find((item) => item.regionId === region.id)
                    if (proposal) setSelectedId(proposal.id)
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
                  style={position}
                >
                  <span className={`relative flex h-8 w-8 items-center justify-center rounded-full border-4 border-white shadow-lg ${active ? 'bg-black ring-8 ring-neutral-300/70' : region.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}>
                    <MapPin className="h-4 w-4 text-white" />
                  </span>
                  <span className={`absolute left-1/2 top-10 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold shadow-sm ${active ? 'bg-black text-white' : 'bg-white text-neutral-600'}`}>{region.id}</span>
                </button>
              )
            })}
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-lg bg-white/90 px-3 py-2 text-[11px] text-neutral-600 shadow-sm backdrop-blur-sm"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-black" />Seleccionada</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-green-500" />Activa</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-amber-500" />Standby</span></div>
          </div>
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
          {regions.map((region) => <RegionCard key={region.id} region={region} selected={region.id === selectedRegion.id} deployedServiceCount={servicesInRegion.get(region.id)} onSelect={() => { const proposal = proposals.find((item) => item.regionId === region.id); if (proposal) setSelectedId(proposal.id) }} />)}
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
