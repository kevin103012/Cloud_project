import { useState } from 'react'
import { Boxes, ClipboardList, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react'
import ProposalForm from '../components/ProposalForm'
import ProposalList from '../components/ProposalList'
import ServiceCard from '../components/ServiceCard'
import { awsServices } from '../data/awsServices'
import { useProposals } from '../hooks/useProposals'
import type { Proposal } from '../types/cloud'

type Tab = 'list' | 'new' | 'services'

const tabs = [
  { id: 'list', label: 'Registradas', icon: ClipboardList },
  { id: 'new', label: 'Registrar', icon: Plus },
  { id: 'services', label: 'Servicios', icon: Boxes },
] as const

export default function Planning() {
  const [tab, setTab] = useState<Tab>('list')
  const [editing, setEditing] = useState<Proposal | null>(null)
  const { proposals, addProposal, updateProposal, resetProposals, clearProposals } = useProposals()

  function handleRegister(proposal: Proposal) {
    addProposal(proposal)
    setTab('list')
  }

  function handleEdit(proposal: Proposal) {
    setEditing(proposal)
    setTab('new')
  }

  function handleUpdate(proposal: Proposal) {
    updateProposal(proposal)
    setEditing(null)
    setTab('list')
  }

  function handleCancelEdit() {
    setEditing(null)
  }

  function handleTabChange(id: Tab) {
    if (id !== 'new') setEditing(null)
    setTab(id)
  }

  return (
    <div className="flex min-w-0 flex-col gap-6 overflow-hidden">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold break-words text-black sm:text-3xl">Planificación</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Registra y consulta las propuestas de solución Cloud.
        </p>
      </div>

      <nav className="flex flex-wrap items-center gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleTabChange(id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
              tab === id
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {id === 'list' && ` (${proposals.length})`}
          </button>
        ))}
        <button
          type="button"
          onClick={resetProposals}
          className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-100 sm:ml-auto"
          title="Restablecer las propuestas de ejemplo"
        >
          <RotateCcw className="h-4 w-4" />
          Restablecer datos
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('¿Borrar todas las propuestas? Esta acción no se puede deshacer.')) {
              clearProposals()
            }
          }}
          className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          title="Borrar todas las propuestas"
        >
          <Trash2 className="h-4 w-4" />
          Borrar datos
        </button>
      </nav>

      {tab === 'list' && <ProposalList proposals={proposals} onEdit={handleEdit} />}

      {tab === 'new' && (
        <div className="flex min-w-0 flex-col gap-4">
          {editing && (
            <div className="flex min-w-0 flex-col gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 text-sm text-amber-800">
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <Pencil className="h-4 w-4" />
                  Editando:
                </span>{' '}
                <span className="font-medium break-words">{editing.solutionName}</span>
                <span className="block text-xs text-amber-700">
                  Añade o quita servicios y regiones sin crear una planificación desde cero.
                </span>
              </p>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 transition hover:bg-amber-100"
              >
                <X className="h-3.5 w-3.5" />
                Cancelar edición
              </button>
            </div>
          )}
          <ProposalForm
            key={editing ? editing.id : 'new'}
            initialProposal={editing ?? undefined}
            submitLabel={editing ? 'Guardar cambios' : undefined}
            onSubmit={editing ? handleUpdate : handleRegister}
          />
        </div>
      )}

      {tab === 'services' && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {awsServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  )
}
