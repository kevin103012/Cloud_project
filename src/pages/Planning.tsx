import { useState } from 'react'
import { Boxes, ClipboardList, Plus, RotateCcw, Trash2 } from 'lucide-react'
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
  const { proposals, addProposal, resetProposals, clearProposals } = useProposals()

  function handleRegister(proposal: Proposal) {
    addProposal(proposal)
    setTab('list')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Planificación</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Registra y consulta las propuestas de solución Cloud.
        </p>
      </div>

      <nav className="flex flex-wrap items-center gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
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
          className="ml-auto flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-100"
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

      {tab === 'list' && <ProposalList proposals={proposals} />}

      {tab === 'new' && <ProposalForm onSubmit={handleRegister} />}

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
