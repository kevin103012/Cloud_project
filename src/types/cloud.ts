export type ServiceCategory =
  | 'Cómputo'
  | 'Almacenamiento'
  | 'Base de datos'
  | 'Seguridad'
  | 'Redes'

export type UsageStatus = 'active' | 'idle'

export interface CloudService {
  id: string
  name: string
  category: ServiceCategory
  description: string
  mainFunction: string
  status: UsageStatus
}

export interface CostItem {
  id: string
  serviceId: string
  serviceName: string
  quantity: number
  unit: string
  unitCost: number
  unitCostLabel: string
  monthlyCost: number
  scalesWithUsers: boolean
}

export type RegionStatus = 'active' | 'standby'

export interface Region {
  id: string
  name: string
  location: string
  services: string[]
  status: RegionStatus
  priceFactor: number
  lat: number
  lng: number
}

export type AvailabilityLevel = '99%' | '99.9%' | '99.99%'

export interface Proposal {
  id: string
  solutionName: string
  appType: string
  description: string
  regionId: string
  estimatedUsers: number
  availability: AvailabilityLevel
  serviceIds: string[]
  migrationGoal: string
  createdAt: string
}

export type StatusLevel = 'ok' | 'warning' | 'error'

export type SecurityArea =
  | 'Responsabilidad compartida'
  | 'IAM'
  | 'Cuentas'
  | 'Datos'
  | 'Cumplimiento'

export interface SecurityCheck {
  id: string
  area: SecurityArea
  title: string
  description: string
  status: StatusLevel
  serviceIds?: string[]
}

export type Owner = 'AWS' | 'Cliente' | 'Compartido'

export interface ResponsibilityItem {
  id: string
  task: string
  owner: Owner
  layer: string
}

export type NetworkKind =
  | 'internet'
  | 'dns'
  | 'cdn'
  | 'vpc'
  | 'compute'
  | 'database'

export interface NetworkNode {
  id: string
  label: string
  kind: NetworkKind
  description: string
  status: StatusLevel
  serviceId?: string
}

export interface NetworkEdge {
  from: string
  to: string
  label: string
}

export interface HardwareTier {
  instanceType: string
  minUsers: number
  minStorageGb: number
  vcpus: number
  ramGb: number
  note: string
}

export type HardwareDimension = 'users' | 'storage'

export interface ServiceHardware {
  serviceId: string
  serviceName: string
  dimension: HardwareDimension
  tiers: HardwareTier[]
}

