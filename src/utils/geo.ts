import { regions } from '../data/regions'
import type { Region } from '../types/cloud'

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const earthRadiusKm = 6371
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function findNearestRegion(
  lat: number,
  lng: number,
  filter?: (region: Region) => boolean,
): { region: Region; distanceKm: number } | null {
  return findNearestRegions(lat, lng, 1, filter)[0] ?? null
}

/**
 * Regiones ordenadas por distancia ascendente desde un punto.
 * Se usa para elegir el servidor principal (la primera) y sugerir
 * réplicas cercanas (las siguientes).
 */
export function findNearestRegions(
  lat: number,
  lng: number,
  limit = regions.length,
  filter?: (region: Region) => boolean,
): { region: Region; distanceKm: number }[] {
  const candidates = filter ? regions.filter(filter) : regions
  return candidates
    .map((region) => ({ region, distanceKm: haversineKm(lat, lng, region.lat, region.lng) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, Math.max(0, limit))
}
