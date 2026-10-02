import { describe, expect, it } from 'vitest'
import { findNearestRegion, findNearestRegions, haversineKm } from './geo'

describe('geolocalización', () => {
  it('calcula distancia cero para el mismo punto', () => {
    expect(haversineKm(0, 0, 0, 0)).toBe(0)
  })

  it('recomienda São Paulo para coordenadas de Lima (Perú)', () => {
    const result = findNearestRegion(-12.05, -77.04, (region) => region.status === 'active')
    expect(result?.region.id).toBe('sa-east-1')
  })

  it('ordena las regiones por distancia ascendente', () => {
    const ranked = findNearestRegions(-12.05, -77.04, 3, (region) => region.status === 'active')
    expect(ranked.length).toBe(3)
    expect(ranked[0].region.id).toBe('sa-east-1')
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i].distanceKm).toBeGreaterThanOrEqual(ranked[i - 1].distanceKm)
    }
    expect(new Set(ranked.map((entry) => entry.region.id)).size).toBe(ranked.length)
  })
})
