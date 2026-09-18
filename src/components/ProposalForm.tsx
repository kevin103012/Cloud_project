import { useState } from 'react'
import type { AvailabilityLevel, Proposal } from '../types/cloud'
import { awsServices } from '../data/awsServices'
import {
  appTypes,
  availabilityLevels,
  migrationGoals,
} from '../data/planning'
import { regions } from '../data/regions'
import { formatUSD } from '../utils/format'

interface ProposalFormProps {
  onSubmit: (proposal: Proposal) => void
}

const inputClass =
  'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-black'

const labelClass = 'mb-1 block text-sm font-medium text-black'

const activeRegions = regions.filter((region) => region.status === 'active')

export default function ProposalForm({ onSubmit }: ProposalFormProps) {
  const [solutionName, setSolutionName] = useState('')
  const [appType, setAppType] = useState(appTypes[0])
  const [description, setDescription] = useState('')
  const [regionId, setRegionId] = useState(activeRegions[0]?.id ?? '')
  const [estimatedUsers, setEstimatedUsers] = useState('')
  const [availability, setAvailability] = useState<AvailabilityLevel>(
    availabilityLevels[1] as AvailabilityLevel,
  )
  const [serviceIds, setServiceIds] = useState<string[]>([])
  const [migrationGoal, setMigrationGoal] = useState(migrationGoals[0])
  const [error, setError] = useState('')

  function toggleService(id: string) {
    setServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  }

  const selectedMonthly = serviceIds.reduce(
    (sum, id) => sum + (awsServices.find((s) => s.id === id)?.monthlyCost ?? 0),
    0,
  )
  const topServices = [...awsServices]
    .sort((a, b) => b.monthlyCost - a.monthlyCost)
    .slice(0, 4)
  const maxCost = topServices[0]?.monthlyCost ?? 0
  const previewRegion = regions.find((r) => r.id === regionId)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const users = Number(estimatedUsers)

    if (solutionName.trim() === '') {
      setError('El nombre de la solución es obligatorio.')
      return
    }
    if (!Number.isFinite(users) || users <= 0) {
      setError('El número estimado de usuarios debe ser mayor a 0.')
      return
    }
    if (serviceIds.length === 0) {
      setError('Selecciona al menos un servicio Cloud.')
      return
    }

    setError('')
    onSubmit({
      id: `prop-${Date.now()}`,
      solutionName: solutionName.trim(),
      appType,
      description: description.trim(),
      regionId,
      estimatedUsers: users,
      availability,
      serviceIds,
      migrationGoal,
      createdAt: new Date().toISOString().slice(0, 10),
    })
  }

  return (
    <div className="grid items-start gap-4 xl:grid-cols-3">
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:grid-cols-2 xl:col-span-2"
      >
      <div className="md:col-span-2">
        <label className={labelClass} htmlFor="solutionName">
          Nombre de la solución
        </label>
        <input
          id="solutionName"
          className={inputClass}
          value={solutionName}
          onChange={(e) => setSolutionName(e.target.value)}
          placeholder="Ej. Portal Empresarial Andina"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="appType">
          Tipo de aplicación
        </label>
        <select
          id="appType"
          className={inputClass}
          value={appType}
          onChange={(e) => setAppType(e.target.value)}
        >
          {appTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="region">
          Región seleccionada
        </label>
        <select
          id="region"
          className={inputClass}
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
        >
          {regions.map((r) => (
            <option key={r.id} value={r.id} disabled={r.status !== 'active'}>
              {r.name}{r.status === 'standby' ? ' (Standby)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className={labelClass} htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          className={`${inputClass} min-h-20 resize-y`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe brevemente la solución propuesta"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="users">
          Número estimado de usuarios
        </label>
        <input
          id="users"
          type="number"
          min={1}
          className={inputClass}
          value={estimatedUsers}
          onChange={(e) => setEstimatedUsers(e.target.value)}
          placeholder="Ej. 15000"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="availability">
          Nivel de disponibilidad
        </label>
        <select
          id="availability"
          className={inputClass}
          value={availability}
          onChange={(e) => setAvailability(e.target.value as AvailabilityLevel)}
        >
          {availabilityLevels.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <span className={labelClass}>Servicios Cloud seleccionados</span>
        <div className="flex flex-wrap gap-2">
          {awsServices.map((s) => {
            const active = serviceIds.includes(s.id)
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleService(s.id)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                  active
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 bg-white text-black hover:border-black'
                }`}
              >
                {s.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="md:col-span-2">
        <label className={labelClass} htmlFor="goal">
          Objetivo de la migración
        </label>
        <select
          id="goal"
          className={inputClass}
          value={migrationGoal}
          onChange={(e) => setMigrationGoal(e.target.value)}
        >
          {migrationGoals.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {error !== '' && (
        <p className="text-sm font-medium text-red-600 md:col-span-2">{error}</p>
      )}

      <div className="md:col-span-2">
        <button
          type="submit"
          className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-neutral-800"
        >
          Registrar propuesta
        </button>
      </div>
      </form>

      <aside className="flex flex-col gap-4 xl:sticky xl:top-6">
        <div className="rounded-2xl border border-black bg-black p-5 text-white shadow-sm">
          <h3 className="text-sm font-semibold">Costo estimado</h3>
          <p className="text-xs text-neutral-400">Según servicios seleccionados</p>
          <p className="mt-2 text-3xl font-bold">{formatUSD(selectedMonthly)}</p>
          <p className="mt-1 text-sm text-neutral-300">
            {formatUSD(selectedMonthly * 12)} / año
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-black">Vista previa</h3>
          <p className="mt-2 text-base font-bold text-black">
            {solutionName.trim() === '' ? 'Sin nombre' : solutionName}
          </p>
          <p className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
            {appType}
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            {description.trim() === '' ? 'Sin descripción' : description}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {serviceIds.length === 0 ? (
              <span className="text-xs text-neutral-400">Sin servicios</span>
            ) : (
              serviceIds.map((id) => (
                <span
                  key={id}
                  className="rounded-full border border-neutral-300 px-2 py-0.5 text-xs text-black"
                >
                  {awsServices.find((s) => s.id === id)?.name ?? id}
                </span>
              ))
            )}
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            {previewRegion?.name} ·{' '}
            {estimatedUsers === ''
              ? '0'
              : Number(estimatedUsers).toLocaleString('es-ES')}{' '}
            usuarios · {availability}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-black">Top servicios</h3>
          <p className="text-xs text-neutral-500">Por costo mensual · clic para agregar</p>
          <div className="mt-3 flex flex-col gap-2.5">
            {topServices.map((s) => {
              const selected = serviceIds.includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  title={s.description}
                  className="text-left"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold ${selected ? 'text-black' : 'text-neutral-600'}`}
                    >
                      {s.name}
                    </span>
                    <span className="text-neutral-400">{formatUSD(s.monthlyCost)}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-neutral-200">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        selected ? 'bg-black' : 'bg-neutral-400'
                      }`}
                      style={{
                        width: `${maxCost === 0 ? 0 : (s.monthlyCost / maxCost) * 100}%`,
                      }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </aside>
    </div>
  )
}
