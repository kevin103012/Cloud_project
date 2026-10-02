import { Pencil } from 'lucide-react'
import type { Proposal } from '../types/cloud'
import { awsServices } from '../data/awsServices'
import { regions } from '../data/regions'

interface ProposalListProps {
  proposals: Proposal[]
  onEdit?: (proposal: Proposal) => void
}

function serviceNames(ids: string[]) {
  return ids.map((id) => awsServices.find((s) => s.id === id)?.name ?? id)
}

export default function ProposalList({ proposals, onEdit }: ProposalListProps) {
  if (proposals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
        <p className="font-semibold text-black">Sin propuestas registradas</p>
        <p className="mt-1 text-sm text-neutral-500">
          Usa la pestaña Registrar para crear la primera.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {proposals.map((p) => {
        const region = regions.find((r) => r.id === p.regionId)
        const replicaNames = (p.secondaryRegionIds ?? []).map(
          (id) => regions.find((r) => r.id === id)?.name ?? id,
        )
        return (
          <article
            key={p.id}
            className="min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="flex min-w-0 items-start justify-between gap-2">
              <h3 className="min-w-0 flex-1 text-lg font-semibold break-words text-black">{p.solutionName}</h3>
              <span className="shrink-0 rounded-full bg-black px-2.5 py-0.5 text-xs font-semibold text-white">
                {p.availability}
              </span>
            </div>
            <p className="mt-0.5 text-xs font-medium tracking-wide text-neutral-400 uppercase">
              {p.appType}
            </p>
            <p className="mt-2 text-sm text-neutral-600">{p.description}</p>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-neutral-400">Servidor principal</dt>
                <dd className="font-medium text-black">{region?.name ?? p.regionId}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-400">Usuarios estimados</dt>
                <dd className="font-medium text-black">
                  {p.estimatedUsers.toLocaleString('es-ES')}
                </dd>
              </div>
              {replicaNames.length > 0 && (
                <div className="col-span-2">
                  <dt className="text-xs text-neutral-400">
                    Réplicas ({replicaNames.length})
                  </dt>
                  <dd className="font-medium text-black">{replicaNames.join(' · ')}</dd>
                </div>
              )}
              <div className="col-span-2">
                <dt className="text-xs text-neutral-400">Objetivo de migración</dt>
                <dd className="font-medium text-black">{p.migrationGoal}</dd>
              </div>
            </dl>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {serviceNames(p.serviceIds).map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-neutral-300 px-2 py-0.5 text-xs text-black"
                >
                  {name}
                </span>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-xs text-neutral-400">Registrada el {p.createdAt}</p>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(p)}
                  title={`Editar ${p.solutionName}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-neutral-100"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </button>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
