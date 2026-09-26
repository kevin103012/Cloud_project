import { awsServices } from '../data/awsServices'
import { costItems } from '../data/costs'
import { regions } from '../data/regions'
import { securityChecks } from '../data/security'
import type { CostItem, HardwareTier, Proposal, SecurityCheck, ServiceHardware, StatusLevel } from '../types/cloud'

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export function getRegionFactor(regionId?: string): number {
  if (!regionId) return 1
  return regions.find((region) => region.id === regionId)?.priceFactor ?? 1
}

export function getServiceCost(serviceId: string, regionId?: string): CostItem | undefined {
  const item = costItems.find((item) => item.serviceId === serviceId)
  if (!item) return undefined
  const factor = getRegionFactor(regionId)
  if (factor === 1) return item
  return {
    ...item,
    unitCost: round(item.unitCost * factor, 4),
    monthlyCost: round(item.monthlyCost * factor, 2),
  }
}

export function getMonthlyCost(serviceIds: string[], regionId?: string): number {
  return serviceIds.reduce(
    (total, serviceId) => total + (getServiceCost(serviceId, regionId)?.monthlyCost ?? 0),
    0,
  )
}

export function recommendTier(
  hardware: ServiceHardware,
  users: number,
): HardwareTier {
  let current = hardware.tiers[0]
  for (const tier of hardware.tiers) {
    if (users >= tier.minUsers) current = tier
  }
  return current
}

export function getValidServicesForProposal(proposal: Proposal) {
  const region = regions.find((item) => item.id === proposal.regionId)
  if (!region) return []
  return awsServices.filter(
    (service) => proposal.serviceIds.includes(service.id) && region.services.includes(service.id),
  )
}

export function getSecurityChecksForProposal(proposal?: Proposal): SecurityCheck[] {
  if (!proposal) return []
  return securityChecks.filter(
    (check) =>
      !check.serviceIds ||
      check.serviceIds.some((serviceId) => proposal.serviceIds.includes(serviceId)),
  )
}

export function summarizeSecurity(checks: SecurityCheck[]): Record<StatusLevel, number> {
  return checks.reduce<Record<StatusLevel, number>>(
    (summary, check) => {
      summary[check.status] += 1
      return summary
    },
    { ok: 0, warning: 0, error: 0 },
  )
}

export function countServicesInRegion(proposals: Proposal[], regionId: string) {
  const region = regions.find((item) => item.id === regionId)
  if (!region) return 0
  return new Set(
    proposals
      .filter((proposal) => proposal.regionId === regionId)
      .flatMap((proposal) => proposal.serviceIds)
      .filter((serviceId) => region.services.includes(serviceId)),
  ).size
}
