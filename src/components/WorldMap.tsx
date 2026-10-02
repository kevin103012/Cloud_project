import { Minus, Plus, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Line,
  Marker,
  Sphere,
} from 'react-simple-maps'
import { ZoomableGroup } from 'react-simple-maps/zoom'
import { regions } from '../data/regions'

type Coordinates = [number, number]

const geoUrl = '/maps/countries-110m.json'

const REPLICA_COLOR = '#2563eb'

const regionCoordinates: Record<string, Coordinates> = Object.fromEntries(
  regions.map((region) => [region.id, [region.lng, region.lat] as Coordinates]),
)

interface WorldMapProps {
  selectedRegionId: string
  availableRegionIds: string[]
  onSelect: (regionId: string) => void
  /**
   * Servidor principal de la planificación visualizada.
   * Por defecto es la región seleccionada.
   */
  primaryRegionId?: string
  /** Servidores secundarios (réplicas) de la planificación visualizada. */
  replicaRegionIds?: string[]
}

export default function WorldMap({
  selectedRegionId,
  availableRegionIds,
  onSelect,
  primaryRegionId,
  replicaRegionIds,
}: WorldMapProps) {
  const [view, setView] = useState<{ center: Coordinates; zoom: number }>({
    center: [0, 3],
    zoom: 1,
  })

  function setZoom(zoom: number) {
    setView((current) => ({ ...current, zoom: Math.min(3, Math.max(1, zoom)) }))
  }

  // Topología de la planificación: principal + réplicas y sus conexiones.
  const primary = primaryRegionId ?? selectedRegionId
  const replicas = (replicaRegionIds ?? []).filter(
    (id, index, list) => id !== primary && list.indexOf(id) === index && regionCoordinates[id],
  )
  const planIds = new Set([primary, ...replicas])
  const primaryCoords = regionCoordinates[primary]
  const planLinks: { id: string; from: Coordinates; to: Coordinates }[] =
    primaryCoords !== undefined
      ? replicas.flatMap((id) => {
          const to = regionCoordinates[id]
          return to ? [{ id, from: primaryCoords, to }] : []
        })
      : []

  // Legado: si la planificación tiene un solo servidor, se dibujan las rutas
  // entre las regiones usadas por las distintas propuestas.
  const availableCoordinates = availableRegionIds.flatMap((id) => {
    const coordinates = regionCoordinates[id]
    return coordinates ? [coordinates] : []
  })
  const origin = availableCoordinates[0]
  const legacyRoutes: [Coordinates, Coordinates][] =
    planLinks.length > 0 || !origin
      ? []
      : availableCoordinates.slice(1).map((coordinates) => [origin, coordinates])

  return (
    <div className="relative mt-5 min-h-[280px] overflow-hidden rounded-2xl border border-subtle bg-[var(--map-ocean)] sm:min-h-[340px]">
      <ComposableMap
        width={1000}
        height={480}
        projection="geoEqualEarth"
        projectionConfig={{ center: [0, 3], scale: 168 }}
        className="h-full min-h-[280px] w-full touch-none sm:min-h-[340px]"
        role="img"
        aria-label="Mapa mundial interactivo con regiones de AWS"
      >
        <ZoomableGroup
          center={view.center}
          zoom={view.zoom}
          minZoom={1}
          maxZoom={3}
          translateExtent={[[0, 0], [1000, 480]]}
          onMoveEnd={({ coordinates, zoom }) =>
            setView({ center: coordinates as Coordinates, zoom: zoom ?? view.zoom })
          }
        >
          <Sphere fill="var(--map-ocean)" stroke="var(--map-coast)" strokeWidth={0.8} />
          <Graticule fill="transparent" stroke="var(--map-grid)" strokeWidth={0.7} />

          <Geographies geography={geoUrl}>
            {({ geographies, borders }) => (
              <>
                {geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="var(--map-land)"
                    stroke="none"
                    className="outline-none transition-colors hover:fill-[var(--map-land-hover)] focus:outline-none"
                  />
                ))}
                <path
                  d={borders?.svgPath ?? ''}
                  fill="none"
                  stroke="var(--map-coast)"
                  strokeWidth={0.55}
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}
          </Geographies>

          {legacyRoutes.map(([from, to]) => (
            <Line
              key={`${from.join(',')}-${to.join(',')}`}
              from={from}
              to={to}
              stroke="var(--map-route)"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              fill="none"
            />
          ))}

          {planLinks.map(({ id, from, to }) => (
            <Line
              key={`plan-${from.join(',')}-${id}`}
              from={from}
              to={to}
              stroke={REPLICA_COLOR}
              strokeWidth={2}
              strokeDasharray="6 4"
              fill="none"
              strokeLinecap="round"
            />
          ))}

          {regions.map((region) => {
            const coordinates = regionCoordinates[region.id]
            const selected = region.id === selectedRegionId
            const available = availableRegionIds.includes(region.id)
            if (!coordinates) return null

            const isPrimary = region.id === primary
            const replicaIndex = replicas.indexOf(region.id)
            const isReplica = replicaIndex >= 0
            const inPlan = planIds.has(region.id)
            const clickable = available || inPlan
            const roleLabel = isPrimary
              ? 'PRINCIPAL'
              : isReplica
                ? `RÉPLICA ${replicaIndex + 1}`
                : null

            return (
              <Marker
                key={region.id}
                coordinates={coordinates}
                onClick={() => clickable && onSelect(region.id)}
                className={clickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-55'}
                role={clickable ? 'button' : 'img'}
                tabIndex={clickable ? 0 : -1}
                aria-label={
                  isPrimary
                    ? `Servidor principal: ${region.name}`
                    : isReplica
                      ? `Servidor réplica: ${region.name}`
                      : available
                        ? `Seleccionar ${region.name}`
                        : `${region.name}, sin propuestas`
                }
                onKeyDown={(event) => {
                  if (clickable && (event.key === 'Enter' || event.key === ' ')) onSelect(region.id)
                }}
              >
                {selected && (
                  <circle r={21} fill="var(--map-selected-ring)" className="animate-pulse" />
                )}
                <circle
                  r={inPlan ? 15 : 13}
                  fill={
                    isPrimary
                      ? 'var(--map-selected)'
                      : isReplica
                        ? REPLICA_COLOR
                        : !available
                          ? 'var(--app-text-muted)'
                          : region.status === 'active'
                          ? '#059669'
                          : '#d97706'
                  }
                  stroke="var(--app-surface)"
                  strokeWidth={3}
                  className="transition-all hover:brightness-110"
                />
                <circle cx={0} cy={-2} r={3.2} fill="none" stroke="#fff" strokeWidth={1.7} />
                <path d="M-5 -2 C-5 4 0 8 0 8 C0 8 5 4 5 -2" fill="none" stroke="#fff" strokeWidth={1.7} strokeLinecap="round" />
                {roleLabel ? (
                  <>
                    <rect
                      x={-42}
                      y={20}
                      width={84}
                      height={38}
                      rx={6}
                      fill={isPrimary ? 'var(--map-selected)' : REPLICA_COLOR}
                      stroke={isPrimary ? 'var(--map-selected)' : REPLICA_COLOR}
                      strokeWidth={1}
                    />
                    <text
                      textAnchor="middle"
                      y={34}
                      fill="#fff"
                      style={{ fontSize: 10, fontWeight: 700, pointerEvents: 'none' }}
                    >
                      {region.id}
                    </text>
                    <text
                      textAnchor="middle"
                      y={48}
                      fill="#fff"
                      style={{ fontSize: 8, fontWeight: 700, pointerEvents: 'none' }}
                    >
                      {roleLabel}
                    </text>
                  </>
                ) : (
                  <>
                    <rect
                      x={-37}
                      y={20}
                      width={74}
                      height={22}
                      rx={6}
                      fill={selected ? 'var(--map-selected)' : 'var(--app-surface)'}
                      stroke={selected ? 'var(--map-selected)' : 'var(--app-border)'}
                      strokeWidth={1}
                    />
                    <text
                      textAnchor="middle"
                      y={34.5}
                      fill={selected ? '#fff' : 'var(--app-text-muted)'}
                      style={{ fontSize: 10, fontWeight: 700, pointerEvents: 'none' }}
                    >
                      {region.id}
                    </text>
                  </>
                )}
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute right-3 top-3 z-10 flex overflow-hidden rounded-lg border border-subtle bg-surface/90 shadow-sm backdrop-blur-sm">
        <button type="button" onClick={() => setZoom(view.zoom - 0.5)} disabled={view.zoom <= 1} className="p-2 text-muted transition hover:bg-surface-muted disabled:opacity-40" title="Alejar" aria-label="Alejar mapa"><Minus className="h-4 w-4" /></button>
        <button type="button" onClick={() => setView({ center: [0, 3], zoom: 1 })} className="border-x border-subtle p-2 text-muted transition hover:bg-surface-muted" title="Restablecer mapa" aria-label="Restablecer mapa"><RotateCcw className="h-4 w-4" /></button>
        <button type="button" onClick={() => setZoom(view.zoom + 0.5)} disabled={view.zoom >= 3} className="p-2 text-muted transition hover:bg-surface-muted disabled:opacity-40" title="Acercar" aria-label="Acercar mapa"><Plus className="h-4 w-4" /></button>
      </div>

      <div className="absolute bottom-3 left-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2 rounded-lg border border-subtle bg-surface/90 px-3 py-2 text-[11px] text-muted shadow-sm backdrop-blur-sm sm:gap-3">
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-brand-700" />Principal</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-blue-600" />Réplica</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-600" />En propuestas</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-amber-600" />Standby</span>
      </div>
    </div>
  )
}
