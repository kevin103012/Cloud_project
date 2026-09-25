import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'

export interface AppRoute {
  path: string
  name: string
  Component: LazyExoticComponent<ComponentType>
}

export const routes: AppRoute[] = [
  { path: '/dashboard', name: 'Dashboard', Component: lazy(() => import('../pages/Dashboard')) },
  { path: '/planning', name: 'Planificación', Component: lazy(() => import('../pages/Planning')) },
  { path: '/costs', name: 'Costos', Component: lazy(() => import('../pages/Costs')) },
  { path: '/infrastructure', name: 'Infraestructura', Component: lazy(() => import('../pages/Infrastructure')) },
  { path: '/security', name: 'Seguridad', Component: lazy(() => import('../pages/Security')) },
  { path: '/network', name: 'Red', Component: lazy(() => import('../pages/Network')) },
  { path: '/services', name: 'Servicios', Component: lazy(() => import('../pages/Services')) },
]
