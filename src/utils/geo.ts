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
  const candidates = filter ? regions.filter(filter) : regions
  if (candidates.length === 0) return null

  let nearest = candidates[0]
  let minDistance = Infinity
  for (const region of candidates) {
    const distance = haversineKm(lat, lng, region.lat, region.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearest = region
    }
  }
  return { region: nearest, distanceKm: minDistance }
}
