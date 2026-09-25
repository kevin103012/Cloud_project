import { createContext } from 'react'
import type { Proposal } from '../types/cloud'

export interface ProposalsContextValue {
  proposals: Proposal[]
  selectedProposalId: string
  setSelectedProposalId: (id: string) => void
  addProposal: (proposal: Proposal) => void
  resetProposals: () => void
}

export const ProposalsContext = createContext<ProposalsContextValue | null>(null)
