import { describe, expect, it } from 'vitest'
import { findNearestRegion, haversineKm } from './geo'

describe('geolocalización', () => {
  it('calcula distancia cero para el mismo punto', () => {
    expect(haversineKm(0, 0, 0, 0)).toBe(0)
  })

  it('recomienda São Paulo para coordenadas de Lima (Perú)', () => {
    const result = findNearestRegion(-12.05, -77.04, (region) => region.status === 'active')
    expect(result?.region.id).toBe('sa-east-1')
  })
})
