import { describe, expect, it } from 'vitest'
import { awsServices } from './awsServices'
import { costItems } from './costs'
import { serviceHardware } from './hardware'
import { networkEdges, networkNodes } from './network'
import { appTypes, proposals, recommendedServices } from './planning'
import { regions } from './regions'
import { securityChecks } from './security'

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

  it('mantiene factor de precio y coordenadas válidas por región', () => {
    for (const region of regions) {
      expect(region.priceFactor).toBeGreaterThan(0)
      expect(Number.isFinite(region.lat)).toBe(true)
      expect(Number.isFinite(region.lng)).toBe(true)
      expect(region.lat).toBeGreaterThanOrEqual(-90)
      expect(region.lat).toBeLessThanOrEqual(90)
      expect(region.lng).toBeGreaterThanOrEqual(-180)
      expect(region.lng).toBeLessThanOrEqual(180)
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

  it('recomienda solo servicios existentes para cada tipo de aplicación', () => {
    for (const appType of appTypes) {
      const ids = recommendedServices[appType] ?? []
      for (const id of ids) expect(serviceIds.has(id)).toBe(true)
    }
  })

  it('define tiers de hardware ordenados y asociados a servicios existentes', () => {
    for (const hardware of serviceHardware) {
      expect(serviceIds.has(hardware.serviceId)).toBe(true)
      expect(hardware.tiers.length).toBeGreaterThan(0)
      for (let i = 1; i < hardware.tiers.length; i++) {
        const prev = hardware.tiers[i - 1]
        const curr = hardware.tiers[i]
        const prevMin = hardware.dimension === 'users' ? prev.minUsers : prev.minStorageGb
        const currMin = hardware.dimension === 'users' ? curr.minUsers : curr.minStorageGb
        expect(currMin).toBeGreaterThanOrEqual(prevMin)
      }
    }
  })

  it('asocia controles de seguridad solo a servicios existentes', () => {
    for (const check of securityChecks) {
      if (check.serviceIds) {
        for (const id of check.serviceIds) {
          expect(serviceIds.has(id)).toBe(true)
        }
      }
    }
  })
})
