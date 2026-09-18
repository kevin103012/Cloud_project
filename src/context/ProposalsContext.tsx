import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { proposals as seedProposals } from '../data/planning'
import type { Proposal } from '../types/cloud'

interface ProposalsContextValue {
  proposals: Proposal[]
  addProposal: (proposal: Proposal) => void
}

const ProposalsContext = createContext<ProposalsContextValue | null>(null)

const STORAGE_KEY = 'cloudopus:proposals'

function loadProposals(): Proposal[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Proposal[]
  } catch {
    /* usa las propuestas iniciales */
  }
  return seedProposals
}

export function ProposalsProvider({ children }: { children: ReactNode }) {
  const [proposals, setProposals] = useState<Proposal[]>(loadProposals)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals))
    } catch {
      /* almacenamiento no disponible */
    }
  }, [proposals])

  function addProposal(proposal: Proposal) {
    setProposals((prev) => [proposal, ...prev])
  }

  return (
    <ProposalsContext.Provider value={{ proposals, addProposal }}>
      {children}
    </ProposalsContext.Provider>
  )
}

export function useProposals() {
  const ctx = useContext(ProposalsContext)
  if (!ctx) throw new Error('useProposals debe usarse dentro de ProposalsProvider')
  return ctx
}
