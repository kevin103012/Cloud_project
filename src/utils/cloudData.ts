import { awsServices } from '../data/awsServices'
import { costItems } from '../data/costs'
import { regions } from '../data/regions'
import { securityChecks } from '../data/security'
import type { Proposal, SecurityCheck, StatusLevel } from '../types/cloud'

export function getServiceCost(serviceId: string) {
  return costItems.find((item) => item.serviceId === serviceId)
}

export function getMonthlyCost(serviceIds: string[]) {
  return serviceIds.reduce(
    (total, serviceId) => total + (getServiceCost(serviceId)?.monthlyCost ?? 0),
    0,
  )
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
