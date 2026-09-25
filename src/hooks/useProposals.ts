import { useContext } from 'react'
import { ProposalsContext } from '../context/proposals-context'

export function useProposals() {
  const context = useContext(ProposalsContext)
  if (!context) throw new Error('useProposals debe usarse dentro de ProposalsProvider')
  return context
}
