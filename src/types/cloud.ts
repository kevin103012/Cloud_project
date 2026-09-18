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
  monthlyCost: number
}

export interface CostItem {
  id: string
  serviceId: string
  serviceName: string
  quantity: number
  unit: string
  hours: number
  unitCost: number
  monthlyCost: number
  scalesWithUsers: boolean
}

export interface CostByCategory {
  category: string
  cost: number
}

export type RegionStatus = 'active' | 'standby'

export interface Region {
  id: string
  name: string
  location: string
  services: string[]
  status: RegionStatus
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
}

export type Owner = 'AWS' | 'Cliente' | 'Compartido'

export interface ResponsibilityItem {
  id: string
  task: string
  owner: Owner
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
}

export interface NetworkEdge {
  from: string
  to: string
  label: string
}

export interface TrendPoint {
  month: string
  cost: number
}

export interface ResourceStat {
  label: string
  value: number
}

export interface DashboardSummary {
  servicesUsed: number
  selectedRegionId: string
  monthlyCost: number
  annualCost: number
  securityScore: number
  totalResources: number
  architectureStatus: string
}
