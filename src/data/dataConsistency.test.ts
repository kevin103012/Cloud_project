import { describe, expect, it } from 'vitest'
import { awsServices } from './awsServices'
import { costItems } from './costs'
import { networkEdges, networkNodes } from './network'
import { proposals } from './planning'
import { regions } from './regions'

describe('consistencia de los mocks cloud', () => {
  const serviceIds = new Set(awsServices.map((service) => service.id))
  const regionIds = new Set(regions.map((region) => region.id))

  it('mantiene identificadores únicos', () => {
    expect(serviceIds.size).toBe(awsServices.length)
    expect(regionIds.size).toBe(regions.length)
    expect(new Set(proposals.map((proposal) => proposal.id)).size).toBe(proposals.length)
  })

  it('asocia cada costo a un servicio existente y sin duplicados', () => {
    expect(new Set(costItems.map((item) => item.serviceId)).size).toBe(costItems.length)
    for (const item of costItems) expect(serviceIds.has(item.serviceId)).toBe(true)
  })

  it('solo declara servicios existentes en las regiones', () => {
    for (const region of regions) {
      for (const serviceId of region.services) expect(serviceIds.has(serviceId)).toBe(true)
    }
  })

  it('mantiene propuestas compatibles con sus regiones', () => {
    for (const proposal of proposals) {
      expect(regionIds.has(proposal.regionId)).toBe(true)
      const region = regions.find((item) => item.id === proposal.regionId)
      expect(region).toBeDefined()
      for (const serviceId of proposal.serviceIds) {
        expect(serviceIds.has(serviceId)).toBe(true)
        expect(region?.services.includes(serviceId)).toBe(true)
      }
    }
  })

  it('mantiene aristas de red entre nodos existentes', () => {
    const nodeIds = new Set(networkNodes.map((node) => node.id))
    for (const edge of networkEdges) {
      expect(nodeIds.has(edge.from)).toBe(true)
      expect(nodeIds.has(edge.to)).toBe(true)
    }
  })
})
