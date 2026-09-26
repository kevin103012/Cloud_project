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

const regionCoordinates: Record<string, Coordinates> = Object.fromEntries(
  regions.map((region) => [region.id, [region.lng, region.lat] as Coordinates]),
)

interface WorldMapProps {
  selectedRegionId: string
  availableRegionIds: string[]
  onSelect: (regionId: string) => void
}

export default function WorldMap({ selectedRegionId, availableRegionIds, onSelect }: WorldMapProps) {
  const [view, setView] = useState<{ center: Coordinates; zoom: number }>({
    center: [0, 3],
    zoom: 1,
  })

  function setZoom(zoom: number) {
    setView((current) => ({ ...current, zoom: Math.min(3, Math.max(1, zoom)) }))
  }

  const availableCoordinates = availableRegionIds.flatMap((id) => {
    const coordinates = regionCoordinates[id]
    return coordinates ? [coordinates] : []
  })
  const origin = availableCoordinates[0]
  const deploymentRoutes: [Coordinates, Coordinates][] = origin
    ? availableCoordinates.slice(1).map((coordinates) => [origin, coordinates])
    : []

  return (
    <div className="relative mt-5 min-h-[340px] overflow-hidden rounded-2xl border border-subtle bg-[var(--map-ocean)]">
      <ComposableMap
        width={1000}
        height={480}
        projection="geoEqualEarth"
        projectionConfig={{ center: [0, 3], scale: 168 }}
        className="h-full min-h-[340px] w-full touch-none"
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

          {deploymentRoutes.map(([from, to]) => (
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

          {regions.map((region) => {
            const coordinates = regionCoordinates[region.id]
            const selected = region.id === selectedRegionId
            const available = availableRegionIds.includes(region.id)
            if (!coordinates) return null

            return (
              <Marker
                key={region.id}
                coordinates={coordinates}
                onClick={() => available && onSelect(region.id)}
                className={available ? 'cursor-pointer' : 'cursor-not-allowed opacity-55'}
                role={available ? 'button' : 'img'}
                tabIndex={available ? 0 : -1}
                aria-label={available ? `Seleccionar ${region.name}` : `${region.name}, sin propuestas`}
                onKeyDown={(event) => {
                  if (available && (event.key === 'Enter' || event.key === ' ')) onSelect(region.id)
                }}
              >
                {selected && (
                  <circle r={21} fill="var(--map-selected-ring)" className="animate-pulse" />
                )}
                <circle
                  r={13}
                  fill={
                    selected
                      ? 'var(--map-selected)'
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

      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-3 rounded-lg border border-subtle bg-surface/90 px-3 py-2 text-[11px] text-muted shadow-sm backdrop-blur-sm">
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-brand-700" />Seleccionada</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-600" />Activa</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-amber-600" />Standby</span>
      </div>
    </div>
  )
}
