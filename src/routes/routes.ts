import type { ComponentType } from 'react'
import Costs from '../pages/Costs'
import Dashboard from '../pages/Dashboard'
import Infrastructure from '../pages/Infrastructure'
import Network from '../pages/Network'
import Planning from '../pages/Planning'
import Security from '../pages/Security'
import Services from '../pages/Services'

export interface AppRoute {
  path: string
  name: string
  Component: ComponentType
}

export const routes: AppRoute[] = [
  { path: '/dashboard', name: 'Dashboard', Component: Dashboard },
  { path: '/planning', name: 'Planificación', Component: Planning },
  { path: '/costs', name: 'Costos', Component: Costs },
  { path: '/infrastructure', name: 'Infraestructura', Component: Infrastructure },
  { path: '/security', name: 'Seguridad', Component: Security },
  { path: '/network', name: 'Red', Component: Network },
  { path: '/services', name: 'Servicios', Component: Services },
]
