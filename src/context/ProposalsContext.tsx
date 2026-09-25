import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { awsServices } from '../data/awsServices'
import { proposals as seedProposals } from '../data/planning'
import { regions } from '../data/regions'
import type { AvailabilityLevel, Proposal } from '../types/cloud'
import { ProposalsContext } from './proposals-context'

interface StoredProposals {
  version: 1
  proposals: Proposal[]
  selectedProposalId: string
}

const STORAGE_KEY = 'cloudopus:proposals:v1'
const LEGACY_STORAGE_KEY = 'cloudopus:proposals'
const availabilityLevels: AvailabilityLevel[] = ['99%', '99.9%', '99.99%']

function normalizeProposal(value: unknown): Proposal | null {
  if (!value || typeof value !== 'object') return null
  const source = value as Record<string, unknown>
  const region = regions.find((item) => item.id === source.regionId)
  if (!region || !Array.isArray(source.serviceIds)) return null

  const knownServiceIds = new Set(awsServices.map((service) => service.id))
  const serviceIds = source.serviceIds.filter(
    (id): id is string =>
      typeof id === 'string' && knownServiceIds.has(id) && region.services.includes(id),
  )
  if (serviceIds.length === 0) return null

  const availability = source.availability
  const estimatedUsers = Number(source.estimatedUsers)
  if (
    typeof source.id !== 'string' ||
    typeof source.solutionName !== 'string' ||
    source.solutionName.trim() === '' ||
    typeof source.appType !== 'string' ||
    typeof source.description !== 'string' ||
    !Number.isFinite(estimatedUsers) ||
    estimatedUsers <= 0 ||
    !availabilityLevels.includes(availability as AvailabilityLevel) ||
    typeof source.migrationGoal !== 'string' ||
    typeof source.createdAt !== 'string'
  ) {
    return null
  }

  return {
    id: source.id,
    solutionName: source.solutionName.trim(),
    appType: source.appType,
    description: source.description,
    regionId: region.id,
    estimatedUsers,
    availability: availability as AvailabilityLevel,
    serviceIds: [...new Set(serviceIds)],
    migrationGoal: source.migrationGoal,
    createdAt: source.createdAt,
  }
}

function normalizeProposals(value: unknown): Proposal[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const proposal = normalizeProposal(item)
    return proposal ? [proposal] : []
  })
}

function getInitialState(): StoredProposals {
  try {
    const current = window.localStorage.getItem(STORAGE_KEY)
    if (current) {
      const parsed = JSON.parse(current) as Partial<StoredProposals>
      const proposals = parsed.version === 1 ? normalizeProposals(parsed.proposals) : []
      if (proposals.length > 0) {
        const selectedProposalId = proposals.some((item) => item.id === parsed.selectedProposalId)
          ? parsed.selectedProposalId as string
          : proposals[0].id
        return { version: 1, proposals, selectedProposalId }
      }
    }

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) {
      const proposals = normalizeProposals(JSON.parse(legacy))
      if (proposals.length > 0) {
        return { version: 1, proposals, selectedProposalId: proposals[0].id }
      }
    }
  } catch {
    // Los datos corruptos se reemplazan por los mocks iniciales.
  }

  return { version: 1, proposals: seedProposals, selectedProposalId: seedProposals[0]?.id ?? '' }
}

export function ProposalsProvider({ children }: { children: ReactNode }) {
  const [initialState] = useState(getInitialState)
  const [proposals, setProposals] = useState<Proposal[]>(initialState.proposals)
  const [selectedProposalId, setSelectedProposalIdState] = useState(initialState.selectedProposalId)

  useEffect(() => {
    const payload: StoredProposals = { version: 1, proposals, selectedProposalId }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      window.localStorage.removeItem(LEGACY_STORAGE_KEY)
    } catch {
      // La aplicación continúa en memoria si el almacenamiento no está disponible.
    }
  }, [proposals, selectedProposalId])

  function setSelectedProposalId(id: string) {
    if (proposals.some((proposal) => proposal.id === id)) setSelectedProposalIdState(id)
  }

  function addProposal(proposal: Proposal) {
    const normalized = normalizeProposal(proposal)
    if (!normalized) return
    setProposals((previous) => [normalized, ...previous.filter((item) => item.id !== normalized.id)])
    setSelectedProposalIdState(normalized.id)
  }

  function resetProposals() {
    setProposals(seedProposals)
    setSelectedProposalIdState(seedProposals[0]?.id ?? '')
  }

  return (
    <ProposalsContext.Provider
      value={{ proposals, selectedProposalId, setSelectedProposalId, addProposal, resetProposals }}
    >
      {children}
    </ProposalsContext.Provider>
  )
}
