import {
  Activity,
  Banknote,
  Boxes,
  ClipboardList,
  MapPin,
  Server,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import CostChart from '../components/CostChart'
import RegionCard from '../components/RegionCard'
import SecurityCard from '../components/SecurityCard'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { useProposals } from '../hooks/useProposals'
import { costItems } from '../data/costs'
import { regions } from '../data/regions'
import {
  countServicesInRegion,
  getSecurityChecksForProposal,
  getValidServicesForProposal,
  summarizeSecurity,
} from '../utils/cloudData'
import { formatUSD } from '../utils/format'

export default function Dashboard() {
  const { proposals, selectedProposalId, setSelectedProposalId } = useProposals()
  const selected = proposals.find((proposal) => proposal.id === selectedProposalId) ?? proposals[0]
  const region = regions.find((item) => item.id === selected?.regionId)
  const selectedServices = selected ? getValidServicesForProposal(selected) : []
  const selectedServiceIds = new Set(selectedServices.map((service) => service.id))
  const selectedCostItems = costItems.filter((item) => selectedServiceIds.has(item.serviceId))
  const monthlyCost = selectedCostItems.reduce((total, item) => total + item.monthlyCost, 0)
  const activeRegionCount = regions.filter((item) => item.status === 'active').length
  const architectureStatus = region?.status === 'active' ? 'Operativa' : 'En revisión'
  const serviceCosts = selectedCostItems.map((item) => ({
    service: item.serviceName,
    cost: item.monthlyCost,
  }))
  const selectedSecurityChecks = getSecurityChecksForProposal(selected)
  const securitySummary = summarizeSecurity(selectedSecurityChecks)
  const issues = selectedSecurityChecks.filter((check) => check.status !== 'ok')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Resumen general de la solución Cloud.
          </p>
        </div>
        <div className="w-full md:w-96">
          <label className="mb-1 block text-sm font-medium text-black" htmlFor="dashboard-proposal">
            Propuesta Cloud
          </label>
          <select
            id="dashboard-proposal"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-black"
            value={selected?.id ?? ''}
            onChange={(event) => setSelectedProposalId(event.target.value)}
            disabled={proposals.length === 0}
          >
            {proposals.length === 0 ? (
              <option value="">No hay propuestas registradas</option>
            ) : (
              proposals.map((proposal) => (
                <option key={proposal.id} value={proposal.id}>
                  {proposal.solutionName}
                </option>
              ))
            )}
          </select>
          <p className="mt-1 text-xs text-neutral-500">
            {selected
              ? `${selected.estimatedUsers.toLocaleString('es-ES')} usuarios · ${selected.availability}`
              : 'Registra una propuesta en Planificación.'}
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Servicios utilizados"
          value={String(selectedServices.length)}
          subtitle={selectedServices.map((service) => service.name).join(' · ') || 'Sin servicios seleccionados'}
          icon={Boxes}
        />
        <StatCard
          title="Región seleccionada"
          value={region?.name ?? 'Sin región'}
          subtitle={region?.location ?? 'Sin ubicación definida'}
          icon={MapPin}
        />
        <StatCard
          title="Costo mensual"
          value={formatUSD(monthlyCost)}
          icon={Wallet}
          inverted
        />
        <StatCard
          title="Costo anual"
          value={formatUSD(monthlyCost * 12)}
          icon={Banknote}
        />
        <StatCard
          title="Servicios estimados"
          value={String(selectedCostItems.length)}
          subtitle="Servicios con una línea de costo"
          icon={Server}
        />
        <StatCard
          title="Estado de seguridad"
          value={`${securitySummary.ok}/${selectedSecurityChecks.length}`}
          subtitle={`${securitySummary.ok} correctos · ${securitySummary.warning} en revisión · ${securitySummary.error} problema`}
          icon={ShieldCheck}
        />
        <StatCard
          title="Arquitectura"
          value={selected ? architectureStatus : 'Sin configurar'}
          subtitle={selected ? `${selected.availability} · ${region?.status === 'active' ? 'Región activa' : 'Región standby'}` : 'Registra una propuesta Cloud'}
          icon={Activity}
        />
        <StatCard
          title="Propuestas Cloud"
          value={String(proposals.length)}
          subtitle="Soluciones planificadas"
          icon={ClipboardList}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold text-black">Costo por servicio</h2>
          <p className="text-xs text-neutral-500">Distribución mensual de la propuesta seleccionada · USD</p>
          <div className="mt-4">
            <CostChart data={serviceCosts} />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-black">Seguridad</h2>
          <p className="text-xs text-neutral-500">Resumen del estado actual</p>
          <p className="mt-3 text-4xl font-bold text-black">
            {securitySummary.ok}
            <span className="text-lg text-neutral-400">/{selectedSecurityChecks.length}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status="ok" label={`${securitySummary.ok} correctos`} />
            <StatusBadge status="warning" label={`${securitySummary.warning} en revisión`} />
            <StatusBadge status="error" label={`${securitySummary.error} problema`} />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {issues.map((check) => (
              <SecurityCard key={check.id} check={check} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-black">Regiones AWS</h2>
            <p className="text-xs text-neutral-500">
              Regiones activas y standby con los servicios asociados a las propuestas.
            </p>
          </div>
          <span className="text-xs font-medium text-neutral-400">
            {activeRegionCount} activas · {regions.length - activeRegionCount} standby
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {regions.map((awsRegion) => (
            <RegionCard
              key={awsRegion.id}
              region={awsRegion}
              selected={awsRegion.id === region?.id}
              deployedServiceCount={countServicesInRegion(proposals, awsRegion.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
