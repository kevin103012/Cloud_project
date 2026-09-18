import { useEffect, useState } from 'react'
import {
  Banknote,
  LayoutGrid,
  Lightbulb,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import CostCard from '../components/CostCard'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { useProposals } from '../context/ProposalsContext'
import { awsServices } from '../data/awsServices'
import { costItems } from '../data/costs'
import { regions } from '../data/regions'
import type { CostItem, StatusLevel } from '../types/cloud'
import { formatUSD } from '../utils/format'

type Period = 'hour' | 'day' | 'week' | 'month' | 'year'

const PERIODS: { id: Period; label: string; factor: number; hours: number }[] = [
  { id: 'hour', label: 'Hora', factor: 1 / 730, hours: 1 },
  { id: 'day', label: 'Día', factor: 24 / 730, hours: 24 },
  { id: 'week', label: 'Semana', factor: 168 / 730, hours: 168 },
  { id: 'month', label: 'Mes', factor: 1, hours: 730 },
  { id: 'year', label: 'Año', factor: 12, hours: 8760 },
]

interface Advice {
  level: StatusLevel
  title: string
  text: string
}

function getAdvice(monthly: number, users: number): Advice {
  const perUser = users > 0 ? monthly / users : 0
  if (perUser <= 0.05) {
    return {
      level: 'ok',
      title: 'Costo eficiente',
      text: `Con ${formatUSD(perUser)} por usuario al mes estás por debajo del umbral de $0.05. La arquitectura actual es sostenible para este volumen.`,
    }
  }
  if (perUser <= 0.2) {
    return {
      level: 'warning',
      title: 'Costo moderado',
      text: `Con ${formatUSD(perUser)} por usuario al mes conviene optimizar antes de escalar: Reserved Instances en EC2/RDS y ciclo de vida en S3.`,
    }
  }
  return {
    level: 'error',
    title: 'Costo elevado',
    text: `Con ${formatUSD(perUser)} por usuario al mes hay sobredimensionamiento: reduce tamaños de instancia, apaga ambientes no productivos y apoya la entrega en CloudFront.`,
  }
}

type CostsTab = 'summary' | 'simulator'

export default function Costs() {
  const { proposals } = useProposals()
  const [tab, setTab] = useState<CostsTab>('summary')
  const [selectedId, setSelectedId] = useState(proposals[0]?.id ?? '')
  const [period, setPeriod] = useState<Period>('month')
  const [projectedUsers, setProjectedUsers] = useState(0)

  const selected = proposals.find((p) => p.id === selectedId) ?? proposals[0]
  const periodInfo = PERIODS.find((p) => p.id === period) ?? PERIODS[3]

  useEffect(() => {
    const current = proposals.find((p) => p.id === selectedId) ?? proposals[0]
    if (current) setProjectedUsers(current.estimatedUsers)
  }, [selectedId, proposals])

  if (!selected) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-black">Costos</h1>
        <p className="text-sm text-neutral-500">
          Registra una propuesta en Planificación para estimar sus costos.
        </p>
      </div>
    )
  }

  const lines: CostItem[] = selected.serviceIds.flatMap((id) => {
    const item = costItems.find((c) => c.serviceId === id)
    return item ? [item] : []
  })
  const monthly = lines.reduce((sum, item) => sum + item.monthlyCost, 0)
  const total = monthly * periodInfo.factor
  const perUser = selected.estimatedUsers > 0 ? monthly / selected.estimatedUsers : 0
  const advice = getAdvice(monthly, selected.estimatedUsers)
  const region = regions.find((r) => r.id === selected.regionId)

  const distributionMap = new Map<string, number>()
  for (const id of selected.serviceIds) {
    const service = awsServices.find((s) => s.id === id)
    if (!service) continue
    distributionMap.set(
      service.category,
      (distributionMap.get(service.category) ?? 0) + service.monthlyCost * periodInfo.factor,
    )
  }
  const distribution = [...distributionMap.entries()]
    .map(([category, cost]) => ({ category, cost }))
    .filter((d) => d.cost > 0)

  // Simulador: los servicios variables escalan con los usuarios, los fijos no
  const baseUsers = selected.estimatedUsers
  const safeProjected = projectedUsers > 0 ? projectedUsers : 0
  const scale = baseUsers > 0 ? safeProjected / baseUsers : 0
  const simMonthly = lines.reduce(
    (sum, item) => sum + (item.scalesWithUsers ? item.monthlyCost * scale : item.monthlyCost),
    0,
  )
  const simPerUser = safeProjected > 0 ? simMonthly / safeProjected : 0
  const delta = simMonthly - monthly
  const deltaPct = monthly > 0 ? (delta / monthly) * 100 : 0
  const simAdvice = getAdvice(simMonthly, safeProjected)
  const fixedNames = lines.filter((l) => !l.scalesWithUsers).map((l) => l.serviceName)

  const compareMap = new Map<string, { actual: number; simulado: number }>()
  for (const id of selected.serviceIds) {
    const service = awsServices.find((s) => s.id === id)
    const item = costItems.find((c) => c.serviceId === id)
    if (!service || !item) continue
    const prev = compareMap.get(service.category) ?? { actual: 0, simulado: 0 }
    compareMap.set(service.category, {
      actual: prev.actual + item.monthlyCost,
      simulado:
        prev.simulado + (item.scalesWithUsers ? item.monthlyCost * scale : item.monthlyCost),
    })
  }
  const comparison = [...compareMap.entries()]
    .map(([category, values]) => ({ category, ...values }))
    .filter((d) => d.actual > 0 || d.simulado > 0)

  const sliderMax = Math.max(baseUsers * 5, 1000)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Costos</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Estimación simulada por propuesta y período.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <label className="mb-1 block text-sm font-medium text-black" htmlFor="proposal">
          Propuesta / Planificación
        </label>
        <select
          id="proposal"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-black md:max-w-md"
          value={selected.id}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {proposals.map((p) => (
            <option key={p.id} value={p.id}>
              {p.solutionName}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-neutral-500">
          {region?.name} · {selected.estimatedUsers.toLocaleString('es-ES')} usuarios ·{' '}
          {selected.availability}
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab('summary')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
            tab === 'summary' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Resumen
        </button>
        <button
          type="button"
          onClick={() => setTab('simulator')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
            tab === 'simulator' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Simulador
        </button>
      </nav>

      {tab === 'summary' && (
        <>
          <div className="flex flex-wrap gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                  period === p.id
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title={`Total por ${periodInfo.label.toLowerCase()}`}
              value={formatUSD(total)}
              icon={Wallet}
              inverted
            />
            <StatCard title="Costo mensual" value={formatUSD(monthly)} icon={Wallet} />
            <StatCard title="Costo anual" value={formatUSD(monthly * 12)} icon={Banknote} />
            <StatCard
              title="Por usuario / mes"
              value={formatUSD(perUser)}
              subtitle={`${selected.estimatedUsers.toLocaleString('es-ES')} usuarios`}
              icon={Users}
            />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-black">Desglose por servicio</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {lines.map((item) => (
                <CostCard
                  key={item.id}
                  item={item}
                  periodLabel={periodInfo.label.toLowerCase()}
                  subtotal={item.monthlyCost * periodInfo.factor}
                  estimatedHours={periodInfo.hours}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-lg font-semibold text-black">Distribución de costos</h2>
              <p className="text-xs text-neutral-500">Por categoría · {periodInfo.label} · USD</p>
              <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribution} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="#737373" tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="#737373"
                      tickLine={false}
                      axisLine={false}
                      width={64}
                      tickFormatter={(v: number) => `$${Math.round(v)}`}
                    />
                    <Tooltip
                      formatter={(v) => formatUSD(Number(v))}
                      labelStyle={{ fontWeight: 600 }}
                      contentStyle={{ borderRadius: 12, borderColor: '#E5E5E5' }}
                    />
                    <Bar dataKey="cost" name="Costo" fill="#111111" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-black" />
                <h2 className="text-lg font-semibold text-black">Guía de gasto</h2>
              </div>
              <div className="mt-3">
                <StatusBadge status={advice.level} label={advice.title} />
              </div>
              <p className="mt-3 text-sm text-neutral-600">{advice.text}</p>
              {selected.availability === '99.99%' && selected.estimatedUsers < 20000 && (
                <p className="mt-3 rounded-lg bg-neutral-100 p-3 text-sm text-neutral-700">
                  La disponibilidad 99.99% (Multi-AZ y réplicas) eleva el costo: con este
                  volumen de usuarios evalúa si 99.9% es suficiente.
                </p>
              )}
            </div>
          </section>
        </>
      )}

      {tab === 'simulator' && (
        <>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-black">Usuarios proyectados</h2>
                <p className="text-xs text-neutral-500">
                  Base actual: {baseUsers.toLocaleString('es-ES')} usuarios · los servicios
                  fijos ({fixedNames.join(', ') || 'ninguno'}) no escalan
                </p>
              </div>
              <input
                type="number"
                min={0}
                value={safeProjected}
                onChange={(e) => setProjectedUsers(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-black md:w-48"
              />
            </div>
            <input
              type="range"
              min={100}
              max={sliderMax}
              step={100}
              value={Math.min(Math.max(safeProjected, 100), sliderMax)}
              onChange={(e) => setProjectedUsers(Number(e.target.value))}
              className="mt-4 w-full accent-black"
            />
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Mensual simulado"
              value={formatUSD(simMonthly)}
              icon={TrendingUp}
              inverted
            />
            <StatCard title="Anual simulado" value={formatUSD(simMonthly * 12)} icon={Banknote} />
            <StatCard
              title="Diferencia vs actual"
              value={`${delta >= 0 ? '+' : ''}${formatUSD(delta)}`}
              subtitle={`${deltaPct >= 0 ? '+' : ''}${deltaPct.toFixed(1)}% mensual`}
              icon={Wallet}
            />
            <StatCard
              title="Por usuario / mes"
              value={formatUSD(simPerUser)}
              subtitle={`${safeProjected.toLocaleString('es-ES')} usuarios`}
              icon={Users}
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-lg font-semibold text-black">Actual vs simulado</h2>
              <p className="text-xs text-neutral-500">Por categoría · mensual · USD</p>
              <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparison} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="#737373" tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="#737373"
                      tickLine={false}
                      axisLine={false}
                      width={64}
                      tickFormatter={(v: number) => `$${Math.round(v)}`}
                    />
                    <Tooltip
                      formatter={(v) => formatUSD(Number(v))}
                      labelStyle={{ fontWeight: 600 }}
                      contentStyle={{ borderRadius: 12, borderColor: '#E5E5E5' }}
                    />
                    <Bar dataKey="actual" name="Actual" fill="#A3A3A3" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="simulado" name="Simulado" fill="#111111" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-black" />
                <h2 className="text-lg font-semibold text-black">Guía de gasto</h2>
              </div>
              <div className="mt-3">
                <StatusBadge status={simAdvice.level} label={simAdvice.title} />
              </div>
              <p className="mt-3 text-sm text-neutral-600">{simAdvice.text}</p>
              <p className="mt-3 rounded-lg bg-neutral-100 p-3 text-sm text-neutral-700">
                Supuesto: EC2, RDS, S3 y CloudFront escalan con los usuarios; Route 53, VPC
                e IAM permanecen fijos.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
