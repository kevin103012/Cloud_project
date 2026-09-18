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
import SecurityCard from '../components/SecurityCard'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import {
  costTrend,
  dashboardSummary,
  resourceStats,
  securitySummary,
} from '../data/dashboard'
import { proposals } from '../data/planning'
import { regions } from '../data/regions'
import { securityChecks } from '../data/security'
import { formatUSD } from '../utils/format'

function resourceValue(label: string) {
  return resourceStats.find((r) => r.label === label)?.value ?? 0
}

export default function Dashboard() {
  const region = regions.find((r) => r.id === dashboardSummary.selectedRegionId)
  const issues = securityChecks.filter((c) => c.status !== 'ok')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Resumen general de la solución Cloud.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Servicios utilizados"
          value={String(dashboardSummary.servicesUsed)}
          subtitle="EC2 · S3 · RDS · IAM · VPC · R53 · CF"
          icon={Boxes}
        />
        <StatCard
          title="Región seleccionada"
          value={region?.name ?? dashboardSummary.selectedRegionId}
          subtitle={region?.location}
          icon={MapPin}
        />
        <StatCard
          title="Costo mensual"
          value={formatUSD(dashboardSummary.monthlyCost)}
          icon={Wallet}
          inverted
        />
        <StatCard
          title="Costo anual"
          value={formatUSD(dashboardSummary.annualCost)}
          icon={Banknote}
        />
        <StatCard
          title="Recursos Cloud"
          value={String(dashboardSummary.totalResources)}
          subtitle={`${resourceValue('Instancias EC2')} EC2 · ${resourceValue('Buckets S3')} S3 · ${resourceValue('Bases de datos RDS')} RDS · ${resourceValue('Usuarios IAM')} IAM`}
          icon={Server}
        />
        <StatCard
          title="Estado de seguridad"
          value={`${dashboardSummary.securityScore}/100`}
          subtitle={`${securitySummary.ok} correctos · ${securitySummary.warning} en revisión · ${securitySummary.error} problema`}
          icon={ShieldCheck}
        />
        <StatCard
          title="Arquitectura"
          value={dashboardSummary.architectureStatus}
          subtitle="Internet → R53 → CF → VPC"
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
          <h2 className="text-lg font-semibold text-black">Tendencia de costos</h2>
          <p className="text-xs text-neutral-500">Costo mensual estimado · USD</p>
          <div className="mt-4">
            <CostChart data={costTrend} />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-black">Seguridad</h2>
          <p className="text-xs text-neutral-500">Resumen del estado actual</p>
          <p className="mt-3 text-4xl font-bold text-black">
            {dashboardSummary.securityScore}
            <span className="text-lg text-neutral-400">/100</span>
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
    </div>
  )
}
